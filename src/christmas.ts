import mqtt from 'mqtt'

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
  console.log('Received:', topic, JSON.stringify(message.toString(), null, 2));
})

client.on('disconnect', () => {
  console.log('Disconnected.')
  if (pingPong) {
    clearInterval(pingPong)
    pingPong = null;
  }
})

client.subscribe('tree/#', { qos: 0 }, (error) => {
  if (error) {
    console.error(error)
  }
})


