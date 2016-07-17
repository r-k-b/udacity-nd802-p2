
# todo

- [✓] get basics working
  - [✓] use `wittr` scaffolding as a reference
    - [✓] build process scaffolding
    - [✓] server skeleton
      - [✓] templating skeleton
- [✓] get data from gtfs api / file (?)
  - [✓] convert gtfs txt → json
  - [ ] optimize data structure? 
  - [✓] upload data to db (csv → mysql)
- [ ] allow users to select a departure and arrival train station
  - [✓] get list of train stations
    - [✓] get list of train routes (`routes where route_type=2`)
    - [✓] get trips for each of those routes
    - [✓] get stop times for each of those trips (ouch!)
    - [✓] get stops for each of those stop times
  - [ ] show routes between selected stations
    - [✓] show selectors on page
    - [ ] find routes between given stations (on selector change)
      - [ ] what will that data look like?
    - [ ] display matching routes
- [ ] use cycle.js?
- [ ] use proper caching (`max-age`, invalidation, etc)
- [ ] use data compression
- [ ] use http/2
