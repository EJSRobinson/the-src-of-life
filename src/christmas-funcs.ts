import ws281x from 'rpi-ws281x-native';

const ledLength = 50;

const channel = ws281x(ledLength, { stripType: ws281x.stripType.WS2811, gpio: 21, brightness: 255 });

function rgb2Int(r, g, b) {
  return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
}

export function colorwheel(pos) {
  pos = 255 - pos;
  if (pos < 85) { return rgb2Int(255 - pos * 3, 0, pos * 3); }
  else if (pos < 170) { pos -= 85; return rgb2Int(0, pos * 3, 255 - pos * 3); }
  else { pos -= 170; return rgb2Int(pos * 3, 255 - pos * 3, 0); }
}

export const fullStop = (controlObject: { controlInterval: NodeJS.Timeout | null }) => {
  console.log('STOP');
  clearInterval(controlObject.controlInterval as any);
  controlObject.controlInterval = null;
  const colorArray = channel.array;
  for (let i = 0; i < channel.count; i++) {
    colorArray[i] = 0x000000;
  }
  ws281x.render(colorArray);
}

export const rainbow = (controlObject: { controlInterval: NodeJS.Timeout | null }) => {
  console.log('START Rainbow');
  fullStop(controlObject);
  let offset = 0;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  controlObject.controlInterval = setInterval(()=>{
    const colorArray = channel.array;
    for (let i = 0; i < channel.count; i++) {
      // colorArray[i] = 0xFF0000;
      colorArray[i] = colorwheel((offset + i) % 256);
    }
    offset = (offset + 1) % channel.count;
    ws281x.render(colorArray);
  }, 1000 / 20);
}

const mobiusColor = (step: number) => {
  const s1 = { r: 44, g: 170, b: 225};
  const s2 = { r: 67, g: 81, b: 155};
  const diff = { r: s2.r - s1.r, g: s2.g - s1.g, b: s2.b - s1.b };
  const totalStep = step / ledLength;
  const result = { r: s1.r + diff.r * totalStep, g: s1.g + diff.g * totalStep, b: s1.b + diff.b * totalStep };
  return rgb2Int(result.r, result.g, result.b);
}


export const mobiusStart = async (controlObject: { controlInterval: NodeJS.Timeout | null }) => {
  console.log('START Mobius');
  fullStop(controlObject);

  let chore = () => {
    return new Promise<void>((resolve) => {
      const colorArray = channel.array;
      let len = 1;
      controlObject.controlInterval = setInterval(()=>{
        for (let i = 0; i < len; i++) {
          colorArray[i] = 0x666666;
        }
        ws281x.render(colorArray);
        len = len + 1;
        if (len > channel.count) {
          resolve();
        }
      }, 100);
    })
  }

  await chore();

  clearInterval(controlObject.controlInterval as any);
  controlObject.controlInterval = null

  chore = () => {
    return new Promise<void>((resolve) => {
      let fade = 0;
      controlObject.controlInterval = setInterval(()=>{
        const colorArray = channel.array;
        if (fade > 255) {
          fade = 255;
        }
        for (let i = 0; i < channel.count; i++) {
          colorArray[i] = rgb2Int(255 - fade, 255 - fade, 255);
        }
        ws281x.render(colorArray);
        if (fade >= 255) {
          resolve();
        }
        fade = fade + 2;
      }, 25);
    })
  }

  await chore();

  clearInterval(controlObject.controlInterval as any);
  controlObject.controlInterval = null
}