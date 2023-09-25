import ws281x from 'rpi-ws281x-native';

const ledLength = 200;

const channel = ws281x(ledLength, { stripType: ws281x.stripType.WS2811, gpio: 21, brightness: 255 });

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

console.log('START');
setInterval(()=>{
  const colorArray = channel.array;
  const choice = getRandomInt(ledLength);
  for (let i = 0; i < channel.count; i++) {
    // colorArray[i] = 0xFF0000;
    colorArray[i] = i === choice ? 0xFFFFF : 0x000000;
  }
  ws281x.render(colorArray);
}, 1000 / 30)
