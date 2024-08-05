"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rpi_ws281x_native_1 = __importDefault(require("rpi-ws281x-native"));
//import { deadPixels } from './structure';
const structure_1 = require("./structure");
const brightness = 255;
const ledLength = 150;
const speed = 15;
const channel = (0, rpi_ws281x_native_1.default)(ledLength, {
    stripType: rpi_ws281x_native_1.default.stripType.WS2811,
    gpio: 21,
    brightness: brightness,
});
// eslint-disable-next-line no-console
let offset = 0;
let direction = true;
setInterval(() => {
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
