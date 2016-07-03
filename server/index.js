import minimist from 'minimist';
import server from './server';

const argv = minimist(process.argv, {
  default: {
    'server-port': 8888,
  },
});

server.start({ port: argv['server-port'] });
