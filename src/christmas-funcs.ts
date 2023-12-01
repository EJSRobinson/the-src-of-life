import ws281x from 'rpi-ws281x-native';

const ledLength = 12;

const channel = ws281x(ledLength, { stripType: 'ws2812', gpio: 21, brightness: 255 });

function rgb2Int(r, g, b) {
  return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
}

export function colorwheel(pos) {
  pos = 255 - pos;
  if (pos < 85) { return rgb2Int(255 - pos * 3, 0, pos * 3); }
  else if (pos < 170) { pos -= 85; return rgb2Int(0, pos * 3, 255 - pos * 3); }
  else { pos -= 170; return rgb2Int(pos * 3, 255 - pos * 3, 0); }
}

export const fullStop = (interval: NodeJS.Timeout | null) => {
  console.log('STOP');
  clearInterval(interval as any);
  interval = null;
  const colorArray = channel.array;
  for (let i = 0; i < channel.count; i++) {
    colorArray[i] = 0x000000;
  }
  ws281x.render(colorArray);
}

export const rainbow = (interval: NodeJS.Timeout | null) => {
  console.log('START Rainbow');
  let offset = 0;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interval = setInterval(()=>{
    const colorArray = channel.array;
    for (let i = 0; i < channel.count; i++) {
      // colorArray[i] = 0xFF0000;
      colorArray[i] = colorwheel((offset + i) % 256);
    }
    offset = (offset + 1) % channel.count;
    ws281x.render(colorArray);
  }, 1000 / 20);
}