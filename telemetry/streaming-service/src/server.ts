import net from "net";
import { WebSocket, WebSocketServer } from "ws";

interface VehicleData {
  battery_temperature: number;
  timestamp: number;
}

const TCP_PORT = 12000;
const WS_PORT = 8080;
const tcpServer = net.createServer();
const websocketServer = new WebSocketServer({ port: WS_PORT });

let tempExceedCount: number = 0;
let tempExceedTimeout: NodeJS.Timeout | null = null;

tcpServer.on("connection", (socket) => {
  console.log("TCP client connected");

  socket.on("data", (msg) => {
    console.log(`Received: ${msg.toString()}`);

    let jsonData: VehicleData;

    try {
      jsonData = JSON.parse(msg.toString());
    } catch (error: any) {
      console.error("Error parsing JSON:", error.message);  
      return;
    }

    if (jsonData.battery_temperature > 80 || jsonData.battery_temperature < 20) {
      tempExceedCount++;
    }

    if (tempExceedCount === 1) {
      tempExceedTimeout = setTimeout(() => {
        tempExceedCount = 0;
        tempExceedTimeout = null;
      }, 5000);
    }
    else if (tempExceedCount > 3) {
      console.log(Date.now() + ": Battery temperature is outside safe range!!!");
      tempExceedCount = 0;
      if (tempExceedTimeout) {
        clearTimeout(tempExceedTimeout);
      }
      tempExceedTimeout = null;
    }

    // Send JSON over WS to frontend clients
    websocketServer.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(msg.toString());
      }
    });
  });

  socket.on("end", () => {
    console.log("Closing connection with the TCP client");
  });

  socket.on("error", (err) => {
    console.log("TCP client error: ", err);
  });
});

websocketServer.on("listening", () =>
  console.log(`Websocket server started on port ${WS_PORT}`)
);

websocketServer.on("connection", async (ws: WebSocket) => {
  console.log("Frontend websocket client connected");
  ws.on("error", console.error);
});

tcpServer.listen(TCP_PORT, () => {
  console.log(`TCP server listening on port ${TCP_PORT}`);
});
