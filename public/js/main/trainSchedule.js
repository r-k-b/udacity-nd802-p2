import { Task } from 'data.task';
import controlAsync from 'control.async';

const Async = controlAsync(Task);

const fetchStations = () => Async.fromPromise(fetch('/gtfs-data/stations.json'));

const main = fetchStations;

export default {
  main,
};
