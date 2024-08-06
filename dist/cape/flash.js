"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.flash = void 0;
const rpi_ws281x_native_1 = __importDefault(require("rpi-ws281x-native"));
//import { deadPixels } from './structure';
const structure_1 = require("./structure");
const colourThems_1 = require("./colourThems");
const flash = (interval, brightness, speed, theme) => {
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
    // eslint-disable-next-line no-console
    let offset2 = 0;
    if (interval) {
        clearInterval(interval);
        interval = null;
    }
    interval = setInterval(() => {
        const prop = Math.random() / 10;
        const colorArray = channel.array;
        for (let i = 0; i < channel.count; i++) {
            colorArray[i] = 0x000000;
        }
        for (const segment of structure_1.expandedMappingJoined) {
            if (Math.random() > prop) {
                for (let i = 0; i < segment.addrs.length; i++) {
                    colorArray[segment.addrs[i]] = (0, colourThems_1.colorwheel)((0, colourThems_1.fade)(theme, offset2));
                }
            }
        }
        offset2 = offset2 + 0.1;
        rpi_ws281x_native_1.default.render(colorArray);
    }, 1000 / speed);
};
exports.flash = flash;
