import { off } from './off';
import { pulse } from './pulse';

// eslint-disable-next-line prefer-const
let mainInterval: NodeJS.Timeout | null = null;

export const main = (topic: string, payload: string) => {
  const message = JSON.parse(payload);
  switch (topic.split('/')[2]) {
    case 'pulse':
      pulse(mainInterval, message.brightness, message.speed);
      break;
    case 'off':
      off(mainInterval);
  }
};
