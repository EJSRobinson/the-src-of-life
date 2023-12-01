import mqtt from 'mqtt'
import { fullStop, mobiusStart, snakes } from './christmas-funcs'

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
const controlObject: { controlInterval: NodeJS.Timeout | null } = { controlInterval: null };

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
    // BLUE
    case '0031C26E':
      msg.button_AI && mobiusStart(controlObject);
      msg.button_B1 && mobiusStart(controlObject);
      msg.button_A0 && fullStop(controlObject);
      msg.button_B0 && fullStop(controlObject);
      break;
    // SHAWN
    case '002F4833':
      msg.button_AI && mobiusStart(controlObject);
      msg.button_B1 && mobiusStart(controlObject);
      msg.button_A0 && mobiusStart(controlObject);
      msg.button_B0 && mobiusStart(controlObject);
      break;
    // WHITE
    case '002F2C32':
      msg.button_AI && snakes.push({ head: 0, color: { r: 0, g: 255, b: 255 }});
      msg.button_B1 && snakes.push({ head: 0, color: { r: 255, g: 0, b: 0 }});
      msg.button_A0 && snakes.push({ head: 0, color: { r: 0, g: 255, b: 0 }});
      msg.button_B0 && snakes.push({ head: 0, color: { r: 255, g: 255, b: 0 }});
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

