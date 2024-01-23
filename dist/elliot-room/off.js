"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.off = void 0;
const ledLength = 194;
function off(controlObject, ws281x) {
    const channel = ws281x(ledLength, {
        stripType: ws281x.stripType.WS2811,
        gpio: 21,
        brightness: 255,
    });
    console.log('off');
    if (controlObject.controlInterval) {
        console.log('clearing interval');
        clearInterval(controlObject.controlInterval);
        controlObject.controlInterval = null;
    }
    controlObject.controlInterval = setInterval(() => {
        console.log('off');
        const colorArray = channel.array;
        for (let i = 0; i < channel.count; i++) {
            colorArray[i] = 0x000000;
        }
        ws281x.render(colorArray);
    }, 1000 / 5);
}
exports.off = off;
