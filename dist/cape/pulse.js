"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pulse = void 0;
const rpi_ws281x_native_1 = __importDefault(require("rpi-ws281x-native"));
//import { deadPixels } from './structure';
const structure_1 = require("./structure");
const pulse = (interval, brightness, speed) => {
    const ledLength = 150;
    const channel = (0, rpi_ws281x_native_1.default)(ledLength, {
        stripType: rpi_ws281x_native_1.default.stripType.WS2811,
        gpio: 21,
        brightness: (() => {
            let result = brightness * 2.55;
            result = Math.round(result);
            if (result > 255)
                result = 255;
            if (result < 0)
                result = 0;
            return result;
        })(),
    });
    console.log(speed);
    // eslint-disable-next-line no-console
    let offset = 0;
    let direction = true;
    if (interval) {
        clearInterval(interval);
        interval = null;
    }
    interval = setInterval(() => {
        const colorArray = channel.array;
        for (let i = 0; i < channel.count; i++) {
            colorArray[i] = 0x000000;
        }
        for (const segment of structure_1.expandedMapping) {
            if (segment.positionX === offset) {
                for (let i = 0; i < segment.addrs.length; i++) {
                    colorArray[segment.addrs[i]] = 0xffffff;
                }
            }
        }
        if (direction) {
            offset = offset + 1;
        }
        else {
            offset = offset - 1;
        }
        if (offset === 5) {
            offset = 3;
            direction = false;
        }
        if (offset === -1) {
            offset = 1;
            direction = true;
        }
        rpi_ws281x_native_1.default.render(colorArray);
    }, 1000 / speed);
};
exports.pulse = pulse;
