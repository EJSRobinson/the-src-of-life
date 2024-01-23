"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mqtt_1 = __importDefault(require("mqtt"));
const off_1 = require("./off");
const rainbow_1 = require("./rainbow");
const rpi_ws281x_native_1 = __importDefault(require("rpi-ws281x-native"));
const protocol = 'mqtts';
const host = 'chilly-badger-99.mobiusflow.io';
const port = '8883';
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
const connectUrl = `${protocol}://${host}:${port}`;
const ledLength = 194;
const client = mqtt_1.default.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    username: 'superUser',
    password: 'superSecret',
    reconnectPeriod: 1000,
});
let pingPong = null;
const controlObject = { controlInterval: null };
client.on('connect', () => {
    console.log('Connected to', connectUrl);
    if (!pingPong) {
        pingPong = setInterval(() => {
            client.publish('tree', 'nodejs mqtt test', { qos: 0, retain: false }, (error) => {
                if (error) {
                    console.error(error);
                }
            });
        }, 5000);
    }
});
client.on('message', (topic, message) => {
    const msg = JSON.parse(message.toString());
    switch (msg.uid) {
        // BLUE
        case '002E236A':
            msg.button_AI && (0, rainbow_1.rainbow)(controlObject, rpi_ws281x_native_1.default, 20, ledLength);
            msg.button_BI && (0, rainbow_1.rainbow)(controlObject, rpi_ws281x_native_1.default, 20, ledLength);
            msg.button_A0 && (0, off_1.off)(controlObject, rpi_ws281x_native_1.default, ledLength);
            msg.button_B0 && (0, off_1.off)(controlObject, rpi_ws281x_native_1.default, ledLength);
            break;
    }
});
client.on('disconnect', () => {
    console.log('Disconnected.');
    if (pingPong) {
        clearInterval(pingPong);
        pingPong = null;
    }
});
client.subscribe('elliotTree/#', { qos: 0 }, (error) => {
    if (error) {
        console.error(error);
    }
});
