import { map, join, compose } from 'ramda';
/* eslint-disable import/no-unresolved */
//noinspection JSFileReferences
import stationRoutes from './templates/routes-between-two-stations';
import stations from '../public/gtfs-data/stations.json';
/* eslint-enable import/no-unresolved */

const makeOptionElem = station =>
  `<option value="${station.station_id}">${station.station_name}</option>`;

const stationOptions = compose(
  join('\n'),
  map(makeOptionElem)
)(stations);

export default {
  optionsHtml: stationOptions,
  routesHtml: stationRoutes({
    stationOptions_arrival: stationOptions,
    stationOptions_departure: stationOptions,
  }),
};
