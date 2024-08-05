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
const speed = 5;
const channel = (0, rpi_ws281x_native_1.default)(ledLength, {
    stripType: rpi_ws281x_native_1.default.stripType.WS2811,
    gpio: 21,
    brightness: brightness,
});
// eslint-disable-next-line no-console
let offset = 0;
setInterval(() => {
    const colorArray = channel.array;
    for (const segment of structure_1.expandedMapping) {
        if (segment.positionX === offset) {
            for (let i = 0; i < segment.addrs.length; i++) {
                colorArray[segment.addrs[i]] = 0xff0000;
            }
        }
    }
    offset = offset + 1;
    if (offset === 5) {
        offset = 0;
    }
    rpi_ws281x_native_1.default.render(colorArray);
}, 1000 / speed);
