import minimist from 'minimist';

const argv = minimist(process.argv, {
  default: {
    'server-port': 8888
  }
});

console.log({argv});