"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mobiusStart = exports.rainbow = exports.fullStop = exports.colorwheel = exports.snakes = void 0;
const rpi_ws281x_native_1 = __importDefault(require("rpi-ws281x-native"));
const ledLength = 50;
const channel = (0, rpi_ws281x_native_1.default)(ledLength, { stripType: rpi_ws281x_native_1.default.stripType.WS2811, gpio: 21, brightness: 255 });
exports.snakes = [];
const snakeLength = 5;
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
const fullStop = (controlObject) => {
    console.log('STOP');
    clearInterval(controlObject.controlInterval);
    controlObject.controlInterval = null;
    const colorArray = channel.array;
    for (let i = 0; i < channel.count; i++) {
        colorArray[i] = 0x000000;
    }
    rpi_ws281x_native_1.default.render(colorArray);
};
exports.fullStop = fullStop;
const rainbow = (controlObject) => {
    console.log('START Rainbow');
    (0, exports.fullStop)(controlObject);
    let offset = 0;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    controlObject.controlInterval = setInterval(() => {
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
const mobiusColor = (step) => {
    const s1 = { r: 44, g: 170, b: 225 };
    const s2 = { r: 67, g: 81, b: 155 };
    const diff = { r: s2.r - s1.r, g: s2.g - s1.g, b: s2.b - s1.b };
    const totalStep = step / ledLength;
    const result = { r: s1.r + diff.r * totalStep, g: s1.g + diff.g * totalStep, b: s1.b + diff.b * totalStep };
    return rgb2Int(result.r, result.g, result.b);
};
const max = 180;
const mobiusStart = async (controlObject) => {
    console.log('START Mobius');
    (0, exports.fullStop)(controlObject);
    let chore = () => {
        return new Promise((resolve) => {
            const colorArray = channel.array;
            let len = 1;
            controlObject.controlInterval = setInterval(() => {
                for (let i = 0; i < len; i++) {
                    colorArray[i] = 0x333333;
                }
                rpi_ws281x_native_1.default.render(colorArray);
                len = len + 1;
                if (len > channel.count) {
                    resolve();
                }
            }, 100);
        });
    };
    await chore();
    clearInterval(controlObject.controlInterval);
    controlObject.controlInterval = null;
    chore = () => {
        return new Promise((resolve) => {
            let fade = 0;
            controlObject.controlInterval = setInterval(() => {
                const colorArray = channel.array;
                if (fade > max) {
                    fade = max;
                }
                for (let i = 0; i < channel.count; i++) {
                    colorArray[i] = rgb2Int(max - fade, max - fade, max);
                }
                rpi_ws281x_native_1.default.render(colorArray);
                if (fade >= max) {
                    resolve();
                }
                fade = fade + 2;
            }, 25);
        });
    };
    await chore();
    clearInterval(controlObject.controlInterval);
    controlObject.controlInterval = null;
    chore = () => {
        return new Promise((resolve) => {
            controlObject.controlInterval = setInterval(() => {
                const colorArray = channel.array;
                for (let i = 0; i < channel.count; i++) {
                    colorArray[i] = rgb2Int(0, 0, max);
                }
                for (let i = 0; i < 5; i++) {
                    colorArray[Math.floor(Math.random() * ledLength)] = rgb2Int(255, 255, 255);
                }
                for (let i = 0; i < exports.snakes.length; i++) {
                    for (let j = 0; j < snakeLength; j++) {
                        let index = exports.snakes[i].head + j;
                        if (index > ledLength) {
                            index = ledLength;
                        }
                        colorArray[index] = rgb2Int(exports.snakes[i].color.r, exports.snakes[i].color.g, exports.snakes[i].color.b);
                    }
                    exports.snakes[i].head = exports.snakes[i].head + 1;
                    if (exports.snakes[i].head > ledLength) {
                        exports.snakes.splice(i, 1);
                    }
                }
                rpi_ws281x_native_1.default.render(colorArray);
            }, 175);
            resolve();
        });
    };
    await chore();
};
exports.mobiusStart = mobiusStart;
