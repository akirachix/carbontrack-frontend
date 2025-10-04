import { useEffect, useState } from "react";

import mqtt from "mqtt";
const MQTT_BROKER = process.env.NEXT_PUBLIC_MQTT_BROKER || "wss://broker.hivemq.com:8000/mqtt";
const MQTT_TOPIC = "esp32/hello";
export function useLiveHiveMQ() {
  const [liveData, setLiveData] = useState<{ time: string; value: number }[]>([]);
  useEffect(() => {
    const options = {
      username: process.env.NEXT_PUBLIC_MQTT_USERNAME,
      password: process.env.NEXT_PUBLIC_MQTT_PASSWORD,
    };
    const client = mqtt.connect(MQTT_BROKER, options);
    client.on("connect", () => {
      client.subscribe(MQTT_TOPIC);
    });
    client.on("message", (topic, message) => {
      try {
        const mqttData = JSON.parse(message.toString());
        setLiveData((prev) => [
          ...prev,
          {
            time: mqttData.timestamp || new Date().toISOString(),
            value: parseFloat(mqttData.co2_emission_kgs),
          },
        ]);
      } catch (err) {
      }
    });
    return () => {
      client.end();
    };
  }, []);
  return liveData;
}