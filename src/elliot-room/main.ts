import mqtt from 'mqtt';
import { off } from './off';
import { rainbow } from './rainbow';
import ws281x from 'rpi-ws281x-native';

const protocol = 'mqtts';
const host = 'chilly-badger-99.mobiusflow.io';
const port = '8883';
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;
const connectUrl = `${protocol}://${host}:${port}`;
const ledLength = 194;

const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'superUser',
  password: 'superSecret',
  reconnectPeriod: 1000,
});

let pingPong: NodeJS.Timeout | null = null;
const controlObject: { controlInterval: NodeJS.Timeout | null } = { controlInterval: null };

client.on('connect', () => {
  console.log('Connected to', connectUrl);
  if (!pingPong) {
    pingPong = setInterval(() => {
      client.publish('tree', 'nodejs mqtt test', { qos: 0, retain: false }, (error) => {
        if (error) {
          console.error(error);
        }
      });
    }, 5000);
  }
});

client.on('message', (topic, message) => {
  const msg = JSON.parse(message.toString());
  switch (msg.uid) {
    // BLUE
    case '002E236A':
      msg.button_AI && rainbow(controlObject, ws281x, ledLength, 20);
      msg.button_BI && rainbow(controlObject, ws281x, ledLength, 20);
      msg.button_A0 && off(controlObject, ws281x, ledLength);
      msg.button_B0 && off(controlObject, ws281x, ledLength);
      break;
  }
});

client.on('disconnect', () => {
  console.log('Disconnected.');
  if (pingPong) {
    clearInterval(pingPong);
    pingPong = null;
  }
});

client.subscribe('elliotTree/#', { qos: 0 }, (error) => {
  if (error) {
    console.error(error);
  }
});
