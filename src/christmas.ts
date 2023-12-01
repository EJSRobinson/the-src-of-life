import mqtt from 'mqtt';
import ws281x from 'rpi-ws281x-native';

// eslint-disable-next-line prefer-const
let interval: NodeJS.Timeout | null = null;

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

export const fullStop = () => {
  console.log('STOP');
  clearInterval(interval as any);
  interval = null;
  const colorArray = channel.array;
  for (let i = 0; i < channel.count; i++) {
    colorArray[i] = 0x000000;
  }
  ws281x.render(colorArray);
}

export const rainbow = () => {
  console.log('START Rainbow');
  let offset = 0;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interval = setInterval(()=>{
    const colorArray = channel.array;
    for (let i = 0; i < channel.count; i++) {
      // colorArray[i] = 0xFF0000;
      colorArray[i] = colorwheel((offset + i) % ledLength);
    }
    offset = (offset + 1) % channel.count;
    ws281x.render(colorArray);
  }, 1000 / 20);
}

const protocol = 'mqtts'
const host = 'hot-bat-53.mobiusflow.io'
const port = '8883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const connectUrl = `${protocol}://${host}:${port}`

const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'mqtt',
  password: 'supersecret',
  reconnectPeriod: 1000,
})

let pingPong: NodeJS.Timeout | null = null;


client.on('connect', () => {
  console.log('Connected to', connectUrl);
  if (!pingPong) {
    pingPong = setInterval(() => {
      client.publish('tree', 'nodejs mqtt test', { qos: 0, retain: false }, (error) => {
        if (error) {
          console.error(error)
        }
      })
    }, 5000)
  }
})

client.on('message', (topic, message) => {
  const msg = JSON.parse(message.toString());
  switch (msg.uid) {
    case '002F2C32':
      msg.button_AI && rainbow();
      msg.button_B1 && rainbow();
      msg.button_A0 && fullStop();
      msg.button_B0 && fullStop();
      break;
  }
})

client.on('disconnect', () => {
  console.log('Disconnected.')
  if (pingPong) {
    clearInterval(pingPong)
    pingPong = null;
  }
})

client.subscribe('christmas/#', { qos: 0 }, (error) => {
  if (error) {
    console.error(error)
  }
})


setInterval(()=>{
  console.log(interval)
}, 500)