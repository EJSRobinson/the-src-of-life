import ws281x from 'rpi-ws281x-native';
//import { deadPixels } from './structure';

export const off = (interval: NodeJS.Timeout | null) => {
  const ledLength = 150;
  const channel = ws281x(ledLength, {
    stripType: ws281x.stripType.WS2811,
    gpio: 21,
    brightness: 255,
  });

  const colorArray = channel.array;
  for (let i = 0; i < channel.count; i++) {
    colorArray[i] = 0x000000;
  }
  ws281x.render(colorArray);

  if (interval) {
    clearInterval(interval);
    interval = null;
  }
};
