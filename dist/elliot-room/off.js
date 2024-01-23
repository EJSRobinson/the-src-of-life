"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.off = void 0;
function off(controlObject, ws281x, ledLength) {
    const channel = ws281x(ledLength, {
        stripType: ws281x.stripType.WS2811,
        gpio: 21,
        brightness: 255,
    });
    if (controlObject.controlInterval) {
        clearInterval(controlObject.controlInterval);
        controlObject.controlInterval = null;
    }
    const colorArray = channel.array;
    for (let i = 0; i < channel.count; i++) {
        colorArray[i] = 0x000000;
    }
    ws281x.render(colorArray);
}
exports.off = off;
