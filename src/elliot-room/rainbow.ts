const ledLength = 194;

export function rainbow(controlObject: { controlInterval: NodeJS.Timeout | null }, ws281x: any) {
  const channel = ws281x(ledLength, {
    stripType: ws281x.stripType.WS2811,
    gpio: 21,
    brightness: 255,
  });

  function colorwheel(pos) {
    pos = 255 - pos;
    if (pos < 85) {
      return rgb2Int(255 - pos * 3, 0, pos * 3);
    } else if (pos < 170) {
      pos -= 85;
      return rgb2Int(0, pos * 3, 255 - pos * 3);
    } else {
      pos -= 170;
      return rgb2Int(pos * 3, 255 - pos * 3, 0);
    }
  }

  function rgb2Int(r, g, b) {
    return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
  }

  if (controlObject.controlInterval) {
    clearInterval(controlObject.controlInterval);
    controlObject.controlInterval = null;
  }
  let offset = 0;
  controlObject.controlInterval = setInterval(() => {
    console.log('rainbow');
    const colorArray = channel.array;
    for (let i = 0; i < channel.count; i++) {
      colorArray[i] = colorwheel((offset + i) % 256);
    }
    offset = (offset + 1) % channel.count;
    ws281x.render(colorArray);
  }, 1000 / 20);
}
