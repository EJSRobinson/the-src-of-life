import ws281x from 'rpi-ws281x-native';
//import { deadPixels } from './structure';
import { expandedMapping } from './structure';

export const pulse = (interval: NodeJS.Timeout | null, brightness: number, speed: number) => {
  const ledLength = 150;
  const channel = ws281x(ledLength, {
    stripType: ws281x.stripType.WS2811,
    gpio: 21,
    brightness: (() => {
      let result = brightness * 2.55;
      result = Math.round(result);
      if (result > 255) result = 255;
      if (result < 0) result = 0;
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
    for (const segment of expandedMapping) {
      if (segment.positionX === offset) {
        for (let i = 0; i < segment.addrs.length; i++) {
          colorArray[segment.addrs[i]] = 0xffffff;
        }
      }
    }
    if (direction) {
      offset = offset + 1;
    } else {
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
    ws281x.render(colorArray);
  }, 1000 / speed);
};
