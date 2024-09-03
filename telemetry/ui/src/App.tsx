import { useState, useEffect } from "react";
import LiveValue from "./live_value";
import RedbackLogo from "./redback_logo.png";
import "./App.css";
import useWebSocket, { ReadyState } from "react-use-websocket";
import TemperatureGraph from "./temp_graph";

const WS_URL = "ws://localhost:8080";

interface VehicleData {
  battery_temperature: number;
  timestamp: number;
}

function App() {
  const [temperature, setTemperature] = useState<number>(0);
  const [temperatureData, setTemperatureData] = useState<Array<{ timestamp: number; temperature: number }>>([]);
  const {
    lastJsonMessage,
    readyState,
  }: { lastJsonMessage: VehicleData | null; readyState: ReadyState } =
    useWebSocket(WS_URL, {
      share: false,
      shouldReconnect: () => true,
    });

  useEffect(() => {
    switch (readyState) {
      case ReadyState.OPEN:
        console.log("Connected to streaming service");
        break;
      case ReadyState.CLOSED:
        console.log("Disconnected from streaming service");
        break;
      default:
        break;
    }
  }, [readyState]);

  useEffect(() => {
    console.log("Received: ", lastJsonMessage);
    if (lastJsonMessage === null) {
      return;
    }
    setTemperature(lastJsonMessage["battery_temperature"]);
    setTemperatureData((prevData) => {
      const updatedData = [
        ...prevData,
        { timestamp: lastJsonMessage.timestamp, temperature: lastJsonMessage.battery_temperature },
      ].filter((entry) => entry.timestamp >= Date.now() - 15000);

      return updatedData;
    });
  }, [lastJsonMessage]);

  return (
    <div className="App">
      <header className="App-header">
        <img
          src={RedbackLogo}
          className="redback-logo"
          alt="Redback Racing Logo"
        />
        <p className="value-title">Live Battery Temperature</p>
        <LiveValue temp={temperature} />
      </header>
      <div className="graph-container">
        <TemperatureGraph data={temperatureData} />
      </div>
    </div>
  );
}

export default App;
