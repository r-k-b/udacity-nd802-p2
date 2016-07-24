import { Observable, Observer } from 'rx';
import { DOM } from 'rx-dom';
import log from 'loglevel';
import { always, path, pathOr } from 'ramda';

log.setDefaultLevel('trace');

const tap = (name = '?') => Observer.create(
  x =>
    log.trace(`[${name}] next:`, x),
  e =>
    log.warn(`[${name}] error:`, e),
  () =>
    log.trace(`[${name}] completed.`)
);

const fetchStationList = Observable
  .fromPromise(fetch('/gtfs-data/stations.json'))
  .share();

fetchStationList.subscribe(tap('fetch'));

const fetchRoutes = ([station1ID, station2ID]) => Observable
  .fromPromise(fetch(`/gtfs-data/stations.json?s1=${station1ID}&s2=${station2ID}`))
  .share();

const b1 = document.querySelector('[data-station-selector="departure"]');
const b2 = document.querySelector('[data-station-selector="arrival"]');

const getStationID = path(['target', 'value']);

const deps = DOM.change(b1).map(getStationID);
const arrs = DOM.change(b2).map(getStationID);

const selectedStations = Observable.combineLatest(deps, arrs);

const main = selectedStations
  .selectMany(fetchRoutes);


export default {
  main,
};
