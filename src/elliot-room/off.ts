export function off(
  controlObject: { controlInterval: NodeJS.Timeout | null },
  ws281x: any,
  ledLength: number,
) {
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
