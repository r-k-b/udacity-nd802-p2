
# todo

- [✓] get basics working
  - [✓] use `wittr` scaffolding as a reference
    - [✓] build process scaffolding
    - [✓] server skeleton
      - [✓] templating skeleton
- [✓] get data from gtfs api / file (?)
  - [✓] convert gtfs txt → json
  - [ ] optimize data structure?
  - [ ] upload json to db (firebase?)
- [ ] allow users to select a departure and arrival train station
  - [ ] get list of train stations
    - [ ] get list of train routes (`routes where route_type=2`)
    - [ ] get trips for each of those routes
    - [ ] get stop times for each of those trips (ouch!)
    - [ ] get stops for each of those stop times
- [ ] use cycle.js?
- [ ] use proper caching (`max-age`, invalidation, etc)
- [ ] use data compression
- [ ] use http/2
