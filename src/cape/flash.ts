import ws281x from 'rpi-ws281x-native';
//import { deadPixels } from './structure';
import { expandedMappingJoined } from './structure';
import { Theme, colorwheel, fade } from './colourThems';

export const conv = (
  interval: NodeJS.Timeout | null,
  brightness: number,
  speed: number,
  theme: Theme,
) => {
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

  // eslint-disable-next-line no-console
  let offset2 = 0;
  if (interval) {
    clearInterval(interval);
    interval = null;
  }
  interval = setInterval(() => {
    const prop = Math.random();
    const colorArray = channel.array;
    for (let i = 0; i < channel.count; i++) {
      colorArray[i] = 0x000000;
    }
    for (const segment of expandedMappingJoined) {
      if (Math.random() > prop) {
        for (let i = 0; i < segment.addrs.length; i++) {
          colorArray[segment.addrs[i]] = colorwheel(fade(theme, offset2));
        }
      }
    }
    offset2 = offset2 + 0.1;
    ws281x.render(colorArray);
  }, 1000 / speed);
};
