import { renderHook, act } from '@testing-library/react';
import { useLiveHiveMQ } from './useLiveMQTT';
import mqtt from 'mqtt';

jest.mock('mqtt', () => {
  return {
    connect: jest.fn(),
  };
});
describe('useLiveHiveMQ', () => {
  let mockClient: {
    on: jest.Mock;
    subscribe: jest.Mock;
    end: jest.Mock;
  };
  beforeEach(() => {
    jest.clearAllMocks();
    mockClient = {
      on: jest.fn(),
      subscribe: jest.fn(),
      end: jest.fn(),
    };
    (mqtt.connect as jest.Mock).mockReturnValue(mockClient);
  });
  const triggerConnect = () => {
    const connectHandlers = mockClient.on.mock.calls
      .filter(([event]) => event === 'connect')
      .map(([, handler]) => handler);
    
    act(() => {
      connectHandlers.forEach(handler => handler());
    });
  };
  const triggerMessage = (topic: string, payload: string) => {
    const messageHandlers = mockClient.on.mock.calls
      .filter(([event]) => event === 'message')
      .map(([, handler]) => handler);
    
    act(() => {
      messageHandlers.forEach(handler => handler(topic, Buffer.from(payload)));
    });
  };
  it('should initialize with empty liveData', () => {
    const { result } = renderHook(() => useLiveHiveMQ());
    expect(result.current).toEqual([]);
  });

  it('should connect to MQTT broker and subscribe to topic', () => {
    renderHook(() => useLiveHiveMQ());
    
    expect(mqtt.connect).toHaveBeenCalledWith(
      process.env.NEXT_PUBLIC_MQTT_BROKER || "wss://broker.hivemq.com:8000/mqtt",
      {
        username: process.env.NEXT_PUBLIC_MQTT_USERNAME,
        password: process.env.NEXT_PUBLIC_MQTT_PASSWORD,
      }
    );
    triggerConnect();
    expect(mockClient.subscribe).toHaveBeenCalledWith("esp32/hello");
  });
  it('should handle valid MQTT message and update liveData', () => {
    const { result } = renderHook(() => useLiveHiveMQ());
    triggerConnect();
    const mockPayload = JSON.stringify({
      timestamp: '2023-01-01T12:00:00Z',
      co2_emission_kgs: 5.2,
    });
    triggerMessage("esp32/hello", mockPayload);
    expect(result.current).toHaveLength(1);
    expect(result.current[0]).toEqual({
      time: '2023-01-01T12:00:00Z',
      value: 5.2,
    });
  });
  it('should handle multiple MQTT messages and update liveData', () => {
    const { result } = renderHook(() => useLiveHiveMQ());
    
    triggerConnect();
    
    const mockPayload1 = JSON.stringify({
      timestamp: '2023-01-01T12:00:00Z',
      co2_emission_kgs: 5.2,
    });
    
    const mockPayload2 = JSON.stringify({
      timestamp: '2023-01-01T12:05:00Z',
      co2_emission_kgs: 4.8,
    });
    
    triggerMessage("esp32/hello", mockPayload1);
    triggerMessage("esp32/hello", mockPayload2);
    expect(result.current).toHaveLength(2);
    expect(result.current[0]).toEqual({
      time: '2023-01-01T12:00:00Z',
      value: 5.2,
    });
    expect(result.current[1]).toEqual({
      time: '2023-01-01T12:05:00Z',
      value: 4.8,
    });
  });

  it('should handle invalid JSON message without crashing', () => {
    const { result } = renderHook(() => useLiveHiveMQ());
    triggerConnect();
    triggerMessage("esp32/hello", 'invalid json');
    
    expect(result.current).toEqual([]);
  });
  it('should handle MQTT message with missing or invalid co2_emission_kgs', () => {
    const { result } = renderHook(() => useLiveHiveMQ());
    triggerConnect();
    
    const mockPayload1 = JSON.stringify({
      timestamp: '2023-01-01T12:00:00Z',
    });
    const mockPayload2 = JSON.stringify({
      timestamp: '2023-01-01T12:05:00Z',
      co2_emission_kgs: 'not a number',
    });
    triggerMessage("esp32/hello", mockPayload1);
    triggerMessage("esp32/hello", mockPayload2);
    
    expect(result.current).toHaveLength(2);
    expect(result.current[0]).toEqual({
      time: '2023-01-01T12:00:00Z',
      value: NaN,
    });
    expect(result.current[1]).toEqual({
      time: '2023-01-01T12:05:00Z',
      value: NaN, 
    });
  });
  it('should handle non-Buffer message without crashing', () => {
    const { result } = renderHook(() => useLiveHiveMQ());
    
    triggerConnect();
    const messageHandlers = mockClient.on.mock.calls
      .filter(([event]) => event === 'message')
      .map(([, handler]) => handler);
    
    act(() => {
      messageHandlers.forEach(handler => handler("esp32/hello", "not a buffer"));
    });
    expect(result.current).toEqual([]);
  });
  it('should clean up on unmount', () => {
    const { unmount } = renderHook(() => useLiveHiveMQ());
    unmount();
    expect(mockClient.end).toHaveBeenCalled();
  });
});