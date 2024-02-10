"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.colorwheel = void 0;
const rpi_ws281x_native_1 = __importDefault(require("rpi-ws281x-native"));
const ledLength = 194;
const channel = (0, rpi_ws281x_native_1.default)(ledLength, {
    stripType: rpi_ws281x_native_1.default.stripType.WS2811,
    gpio: 21,
    brightness: 255,
});
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
function rgb2Int(r, g, b) {
    return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
}
let offset = 0;
// eslint-disable-next-line no-console
console.log('START');
setInterval(() => {
    const colorArray = channel.array;
    for (let i = 0; i < channel.count; i++) {
        // colorArray[i] = 0xFF0000;
        const param = offset + Math.round(i * (256 / ledLength));
        console.log(param);
        colorArray[i] = colorwheel(param % 256);
    }
    offset = (offset + 1) % channel.count;
    rpi_ws281x_native_1.default.render(colorArray);
}, 1000 / 20);
