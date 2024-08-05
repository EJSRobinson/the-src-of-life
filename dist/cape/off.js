"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.off = void 0;
const rpi_ws281x_native_1 = __importDefault(require("rpi-ws281x-native"));
//import { deadPixels } from './structure';
const off = (interval) => {
    const ledLength = 150;
    const channel = (0, rpi_ws281x_native_1.default)(ledLength, {
        stripType: rpi_ws281x_native_1.default.stripType.WS2811,
        gpio: 21,
        brightness: 255,
    });
    const colorArray = channel.array;
    for (let i = 0; i < channel.count; i++) {
        colorArray[i] = 0x000000;
    }
    rpi_ws281x_native_1.default.render(colorArray);
    if (interval) {
        clearInterval(interval);
        interval = null;
    }
};
exports.off = off;
