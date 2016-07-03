import minimist from 'minimist';
import server from './server';

const argv = minimist(process.argv, {
  default: {
    'server-port': 8888
  }
});

console.log({argv});