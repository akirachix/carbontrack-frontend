'use client';
import { useEffect } from 'react';
import mqtt from 'mqtt';

const base_Url = process.env.BASE_URL
const MqttSubscriber = () => {
  useEffect(() => {
    const broker = process.env.NEXT_PUBLIC_MQTT_BROKER;
    const options = {
      username: process.env.NEXT_PUBLIC_MQTT_USERNAME,
      password: process.env.NEXT_PUBLIC_MQTT_PASSWORD,
    };
    const client = mqtt.connect(broker, options);

    client.on('connect', () => {
      client.subscribe('esp32/hello', (err) => {
        
      });
    });

    client.on('message', (topic, message) => {
      try {
        const mqttData = JSON.parse(message.toString());
        const postData = {
          device_id: mqttData.device_id,
          emission_rate: mqttData.co2_emission_kgs,
        };
        fetch(base_Url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        })
          .then(res => res.json())
          .then(response => {
            console.log('Backend API response:', response);
          })
          .catch(error => {
            console.error('Error posting to backend:', error);
          });
      } catch (err) {
        console.error('Failed to parse MQTT message JSON', err);
      }
    });

    client.on('error', (err) => {
      console.error('MQTT Client Error:', err);
      client.end();
    });

    client.on('reconnect', () => {
      console.log('MQTT reconnecting...');
    });

    return () => {
      client.end();
    };
  }, []);

  return null;
};

export default MqttSubscriber;
