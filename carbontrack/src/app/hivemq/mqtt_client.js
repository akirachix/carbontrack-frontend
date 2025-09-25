'use client';
import { useEffect } from 'react';
import mqtt from 'mqtt';
const MqttSubscriber = () => {
  useEffect(() => {
const broker = 'wss://57652ef3c2f34337b4fe5619db6f16b9.s1.eu.hivemq.cloud:8884/mqtt';
    const options = {
      username: 'CarbonTrack',
      password: '@Carbontrack2025',}
    const client = mqtt.connect(broker, options);
    client.on('connect', () => {
      client.subscribe('esp32/hello', (err) => {
        if (err) {
          return Error('Subscription error:', err);
        } else {
          return 'Subscribed to topic esp32/hello';
        }
      });
    });
    client.on('message', (topic, message) => {
      try {
        const mqttData = JSON.parse(message.toString());
        const postData = {
          device_id: mqttData.device_id,
          emission_rate: mqttData.co2_emission_kgs,
        };
        fetch('https://carbon-track-680e7cff8d27.herokuapp.com/api/emissions/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        })
          .then(res => res.json())
          .then(response => {
            return 'Backend API response:', response;
          })
          .catch(error => {
            return Error('Error posting to backend:', error);
          });
      } catch (err) {
        return Error('Failed to parse MQTT message JSON', err);
      }
    });
    client.on('error', (err) => {
      console.error('MQTT Client Error:', err);
      client.end();
    });
    client.on('reconnect', () => {
      return 'MQTT reconnecting...';
    });
    return () => {
      client.end();
    };
  }, []);
  return null;
};
export default MqttSubscriber;