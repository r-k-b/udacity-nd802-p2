
# loading data into mysql, from raw gtfs text (csv) files

```
USE gtfs1;

LOAD DATA LOCAL INFILE '/home/rkb/projects/udacity-nd802-p2/gtfs/greater-nsw/agency.txt'
INTO TABLE agency
COLUMNS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
ESCAPED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(agency_id, agency_name, agency_url, agency_timezone, agency_lang, agency_phone);

LOAD DATA LOCAL INFILE '/home/rkb/projects/udacity-nd802-p2/gtfs/greater-nsw/calendar.txt'
INTO TABLE calendar
COLUMNS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
ESCAPED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(service_id, monday, tuesday, wednesday, thursday, friday, saturday, sunday, start_date, end_date);

LOAD DATA LOCAL INFILE '/home/rkb/projects/udacity-nd802-p2/gtfs/greater-nsw/calendar_dates.txt'
INTO TABLE calendar_dates
COLUMNS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
ESCAPED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(service_id, date, exception_type);

LOAD DATA LOCAL INFILE '/home/rkb/projects/udacity-nd802-p2/gtfs/greater-nsw/routes.txt'
INTO TABLE routes
COLUMNS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
ESCAPED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(route_id, agency_id, route_short_name, route_long_name, route_desc, route_type, route_color, route_text_color);

LOAD DATA LOCAL INFILE '/home/rkb/projects/udacity-nd802-p2/gtfs/greater-nsw/shapes.txt'
INTO TABLE shapes
COLUMNS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
ESCAPED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(shape_id, shape_pt_lat, shape_pt_lon, shape_pt_sequence, shape_dist_traveled);

LOAD DATA LOCAL INFILE '/home/rkb/projects/udacity-nd802-p2/gtfs/greater-nsw/stop_times.txt'
INTO TABLE stop_times
COLUMNS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
ESCAPED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(trip_id, arrival_time, departure_time, stop_id, stop_sequence, stop_headsign, pickup_type, drop_off_type, shape_dist_traveled);

LOAD DATA LOCAL INFILE '/home/rkb/projects/udacity-nd802-p2/gtfs/greater-nsw/stops.txt'
INTO TABLE stops
COLUMNS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
ESCAPED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(stop_id,stop_code,stop_name,stop_lat,stop_lon,location_type,parent_station,wheelchair_boarding,platform_code);

LOAD DATA LOCAL INFILE '/home/rkb/projects/udacity-nd802-p2/gtfs/greater-nsw/trips.txt'
INTO TABLE trips
COLUMNS TERMINATED BY ','
OPTIONALLY ENCLOSED BY '"'
ESCAPED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 LINES
(route_id,service_id,trip_id,shape_id,trip_headsign,direction_id,block_id,wheelchair_accessible);
```