import ws281x from 'rpi-ws281x-native';
//import { deadPixels } from './structure';
import { expandedMapping } from './structure';

const brightness = 255;
const ledLength = 150;
const speed = 5;

const channel = ws281x(ledLength, {
  stripType: ws281x.stripType.WS2811,
  gpio: 21,
  brightness: brightness,
});

// eslint-disable-next-line no-console
let offset = 0;
setInterval(() => {
  const colorArray = channel.array;
  for (let i = 0; i < channel.count; i++) {
    colorArray[i] = 0x000000;
  }
  for (const segment of expandedMapping) {
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
  ws281x.render(colorArray);
}, 1000 / speed);
