"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.colorwheel = exports.fade = exports.themes = void 0;
exports.themes = [
    {
        name: 'red',
        colours: [0xff0000, 0xff0000, 0xff4600, 0xffff00],
    },
];
const fade = (theme, prop) => {
    const start = theme.colours[0];
    const end = theme.colours[1];
    const normaliseProp = ((prop * 100) % 100) / 100;
    if (end > start) {
        return Math.round(start + (end - start) * normaliseProp);
    }
    else {
        return Math.round(start - (start - end) * normaliseProp);
    }
};
exports.fade = fade;
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
