import ws281x from 'rpi-ws281x-native';

const channel = ws281x(50, { stripType: 'ws2811', gpio: 26, brightness: 255 });

const colorArray = channel.array;
for (let i = 0; i < channel.count; i++) {
  colorArray[i] = 0xffcc22;
}

ws281x.render();