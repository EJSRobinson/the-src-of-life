"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rainbow = exports.fullStop = exports.colorwheel = void 0;
const mqtt_1 = __importDefault(require("mqtt"));
const rpi_ws281x_native_1 = __importDefault(require("rpi-ws281x-native"));
// eslint-disable-next-line prefer-const
let interval = null;
const ledLength = 12;
const channel = (0, rpi_ws281x_native_1.default)(ledLength, { stripType: 'ws2812', gpio: 21, brightness: 255 });
function rgb2Int(r, g, b) {
    return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
}
function colorwheel(pos) {
    pos = 255 - pos;
    if (pos < 85) {
        return rgb2Int(255 - pos * 3, 0, pos * 3);
    }
    else if (pos < 170) {
        pos -= 85;
        return rgb2Int(0, pos * 3, 255 - pos * 3);
    }
    else {
        pos -= 170;
        return rgb2Int(pos * 3, 255 - pos * 3, 0);
    }
}
exports.colorwheel = colorwheel;
const fullStop = () => {
    console.log('STOP');
    clearInterval(interval);
    interval = null;
    const colorArray = channel.array;
    for (let i = 0; i < channel.count; i++) {
        colorArray[i] = 0x000000;
    }
    rpi_ws281x_native_1.default.render(colorArray);
};
exports.fullStop = fullStop;
const rainbow = () => {
    console.log('START Rainbow');
    let offset = 0;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interval = setInterval(() => {
        const colorArray = channel.array;
        for (let i = 0; i < channel.count; i++) {
            // colorArray[i] = 0xFF0000;
            colorArray[i] = colorwheel((offset + i) % ledLength);
        }
        offset = (offset + 1) % channel.count;
        rpi_ws281x_native_1.default.render(colorArray);
    }, 1000 / 20);
};
exports.rainbow = rainbow;
const protocol = 'mqtts';
const host = 'hot-bat-53.mobiusflow.io';
const port = '8883';
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
const connectUrl = `${protocol}://${host}:${port}`;
const client = mqtt_1.default.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    username: 'mqtt',
    password: 'supersecret',
    reconnectPeriod: 1000,
});
let pingPong = null;
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
        case '002F2C32':
            msg.button_AI && (0, exports.rainbow)();
            msg.button_B1 && (0, exports.rainbow)();
            msg.button_A0 && (0, exports.fullStop)();
            msg.button_B0 && (0, exports.fullStop)();
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
client.subscribe('christmas/#', { qos: 0 }, (error) => {
    if (error) {
        console.error(error);
    }
});
setInterval(() => {
    console.log(interval);
}, 500);
