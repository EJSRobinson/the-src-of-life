"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rainbow = exports.fullStop = exports.colorwheel = void 0;
const rpi_ws281x_native_1 = __importDefault(require("rpi-ws281x-native"));
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
const fullStop = (interval) => {
    console.log('STOP');
    if (interval) {
        clearInterval(interval);
        interval = null;
        console.log('Interval cleared.');
    }
    const colorArray = channel.array;
    for (let i = 0; i < channel.count; i++) {
        colorArray[i] = 0x000000;
    }
    rpi_ws281x_native_1.default.render(colorArray);
};
exports.fullStop = fullStop;
const rainbow = (interval) => {
    console.log('START Rainbow');
    let offset = 0;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interval = setInterval(() => {
        const colorArray = channel.array;
        for (let i = 0; i < channel.count; i++) {
            // colorArray[i] = 0xFF0000;
            colorArray[i] = colorwheel((offset + i) % 256);
        }
        offset = (offset + 1) % channel.count;
        rpi_ws281x_native_1.default.render(colorArray);
    }, 1000 / 20);
};
exports.rainbow = rainbow;
