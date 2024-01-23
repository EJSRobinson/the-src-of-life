import ws281x from 'rpi-ws281x-native';

const ledLength = 194;

const channel = ws281x(ledLength, {
  stripType: ws281x.stripType.WS2811,
  gpio: 21,
  brightness: 255,
});

export function off(controlObject: { controlInterval: NodeJS.Timeout | null }) {
  console.log('off');
  if (controlObject.controlInterval) {
    console.log('clearing interval');
    clearInterval(controlObject.controlInterval);
    controlObject.controlInterval = null;
  }
  const colorArray = channel.array;
  for (let i = 0; i < channel.count; i++) {
    console.log(i);
    colorArray[i] = 0x000000;
  }
  console.log(colorArray);
  ws281x.render(colorArray);
}
