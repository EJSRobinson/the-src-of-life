import { themes } from './colourThems';
import { conv } from './conv';
import { off } from './off';
import { pulse } from './pulse';
import { pulse2 } from './pulse2';

// eslint-disable-next-line prefer-const
let mainInterval: NodeJS.Timeout | null = null;

export const main = (topic: string, payload: string) => {
  let message: any = {};
  try {
    message = JSON.parse(payload);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('Error parsing message', e);
    return;
  }
  console.log(topic, message);
  switch (topic.split('/')[2]) {
    case 'pulse':
      if (message.brightness !== undefined && message.speed !== undefined) {
        pulse(mainInterval, message.brightness, message.speed);
      }
      break;
    case 'pulse2':
      if (
        message.brightness !== undefined &&
        message.speed !== undefined &&
        message.theme !== undefined
      ) {
        const theme = themes.find((t) => t.name === message.theme);
        if (theme !== undefined) {
          pulse2(mainInterval, message.brightness, message.speed, theme);
        }
      }
      break;
    case 'conv':
      if (
        message.brightness !== undefined &&
        message.speed !== undefined &&
        message.theme !== undefined
      ) {
        const theme = themes.find((t) => t.name === message.theme);
        if (theme !== undefined) {
          conv(mainInterval, message.brightness, message.speed, theme);
        }
      }
      break;
    case 'off':
      off(mainInterval);
  }
};
