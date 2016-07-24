import IndexController from './IndexController';
import trainSchedule from './trainSchedule';
import { Observer } from 'rx';
import log from 'loglevel';

log.setDefaultLevel('trace');

const tap = (name = '?') => Observer.create(
  x =>
    log.trace(`[${name}] next:`, x),
  e =>
    log.warn(`[${name}] error:`, e),
  () =>
    log.trace(`[${name}] completed.`)
);

IndexController(document.querySelector('.app-main')); // eslint-disable-line new-cap

trainSchedule.main.subscribe(tap('main'));
