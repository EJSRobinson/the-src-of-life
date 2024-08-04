"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mosca = __importStar(require("mosca"));
const mqtt = __importStar(require("mqtt"));
// *** SERVER ***
// Mosca settings
const settings = {
    port: 1883, // Default MQTT port
};
// Create a Mosca server instance
const server = new mosca.Server(settings);
// Event fired when the server is ready
server.on('ready', () => {
    console.log('MQTT broker is up and running on port 1883');
});
// Event fired when a client connects
server.on('clientConnected', (client) => {
    console.log('Client connected:', client.id);
});
// Event fired when a message is received
// server.on('published', (packet, client) => {
//     console.log('Published', packet.payload.toString());
// });
// Event fired when a client disconnects
server.on('clientDisconnected', (client) => {
    console.log('Client disconnected:', client.id);
});
// *** CLIENT ***
// Connect to the MQTT broker
const client = mqtt.connect('mqtt://localhost:1883');
// Event fired when the client is connected
client.on('connect', () => {
    console.log('Connected to MQTT broker');
    // Subscribe to a topic
    client.subscribe('cape/500a2ff2-76bc-4dcb-a6d6-40fd1287ee97/#', (err) => {
        if (!err) {
            // Publish a message to the topic
            client.publish('test/topic', 'Hello MQTT');
        }
    });
});
// Event fired when a message is received
client.on('message', (topic, message) => {
    console.log(`Received message on topic ${topic}: ${message.toString()}`);
});
// Event fired when the client is disconnected
client.on('close', () => {
    console.log('Disconnected from MQTT broker');
});
