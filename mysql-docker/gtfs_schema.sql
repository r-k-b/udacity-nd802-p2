# from https://github.com/r-k-b/gtfs-mysql

USE gtfs1;

CREATE TABLE `agency` (
  id              INT(12)       NOT NULL PRIMARY KEY AUTO_INCREMENT,
  transit_system  NVARCHAR(50)  NOT NULL,
  agency_id       NVARCHAR(100),
  agency_name     NVARCHAR(255) NOT NULL,
  agency_url      NVARCHAR(255) NOT NULL,
  agency_timezone NVARCHAR(100) NOT NULL,
  agency_lang     NVARCHAR(100),
  agency_phone    NVARCHAR(100),
  agency_fare_url NVARCHAR(100)
);

CREATE TABLE `calendar_dates` (
  id             INT(12)       NOT NULL PRIMARY KEY AUTO_INCREMENT,
  transit_system NVARCHAR(50)  NOT NULL,
  service_id     NVARCHAR(255) NOT NULL,
  `date`         NVARCHAR(8)   NOT NULL,
  exception_type TINYINT(2)    NOT NULL,
  KEY `service_id` (service_id),
  KEY `exception_type` (exception_type)
);

CREATE TABLE `calendar` (
  id             INT(12)       NOT NULL PRIMARY KEY AUTO_INCREMENT,
  transit_system NVARCHAR(50)  NOT NULL,
  service_id     NVARCHAR(255) NOT NULL,
  monday         TINYINT(1)    NOT NULL,
  tuesday        TINYINT(1)    NOT NULL,
  wednesday      TINYINT(1)    NOT NULL,
  thursday       TINYINT(1)    NOT NULL,
  friday         TINYINT(1)    NOT NULL,
  saturday       TINYINT(1)    NOT NULL,
  sunday         TINYINT(1)    NOT NULL,
  start_date     NVARCHAR(8)   NOT NULL,
  end_date       NVARCHAR(8)   NOT NULL,
  KEY `service_id` (service_id)
);

CREATE TABLE `routes` (
  id               INT(12)       NOT NULL PRIMARY KEY AUTO_INCREMENT,
  transit_system   NVARCHAR(50)  NOT NULL,
  route_id         NVARCHAR(100),
  agency_id        NVARCHAR(50),
  route_short_name NVARCHAR(50)  NOT NULL,
  route_long_name  NVARCHAR(255) NOT NULL,
  route_type       NVARCHAR(2)   NOT NULL,
  route_text_color NVARCHAR(255),
  route_color      NVARCHAR(255),
  route_url        NVARCHAR(255),
  route_desc       NVARCHAR(255),
  KEY `agency_id` (agency_id),
  KEY `route_type` (route_type)
);

CREATE TABLE `shapes` (
  id                  INT(12)         NOT NULL PRIMARY KEY AUTO_INCREMENT,
  transit_system      NVARCHAR(50)    NOT NULL,
  shape_id            NVARCHAR(100)   NOT NULL,
  shape_pt_lat        DECIMAL(28, 14) NOT NULL,
  shape_pt_lon        DECIMAL(28, 14) NOT NULL,
  shape_pt_sequence   INT(1)          NOT NULL,
  shape_dist_traveled NVARCHAR(50),
  KEY `shape_id` (shape_id)
);

CREATE TABLE `stop_times` (
  id                     INT(12)       NOT NULL PRIMARY KEY AUTO_INCREMENT,
  transit_system         NVARCHAR(50)  NOT NULL,
  trip_id                NVARCHAR(100) NOT NULL,
  arrival_time           NVARCHAR(8)   NOT NULL,
  arrival_time_seconds   INT(100),
  departure_time         NVARCHAR(8)   NOT NULL,
  departure_time_seconds INT(100),
  stop_id                NVARCHAR(100) NOT NULL,
  stop_sequence          NVARCHAR(100) NOT NULL,
  stop_headsign          NVARCHAR(50),
  pickup_type            NVARCHAR(2),
  drop_off_type          NVARCHAR(2),
  shape_dist_traveled    NVARCHAR(50),
  stop_note_id           NVARCHAR(100), # TfNSW extension
  KEY `trip_id` (trip_id),
  KEY `arrival_time_seconds` (arrival_time_seconds),
  KEY `departure_time_seconds` (departure_time_seconds),
  KEY `stop_id` (stop_id),
  KEY `stop_sequence` (stop_sequence),
  KEY `pickup_type` (pickup_type),
  KEY `drop_off_type` (drop_off_type)
);

# TfNSW extension
CREATE TABLE `notes` (
  id        INT(12)       NOT NULL PRIMARY KEY AUTO_INCREMENT,
  note_id   NVARCHAR(100) NOT NULL,
  note_text NVARCHAR(255)
);

CREATE TABLE `stops` (
  id                  INT(12)        NOT NULL PRIMARY KEY AUTO_INCREMENT,
  transit_system      NVARCHAR(50)   NOT NULL,
  stop_id             NVARCHAR(255),
  stop_code           NVARCHAR(50),
  stop_name           NVARCHAR(255)  NOT NULL,
  stop_desc           NVARCHAR(255),
  stop_lat            DECIMAL(28, 14) NOT NULL,
  stop_lon            DECIMAL(28, 14) NOT NULL,
  zone_id             NVARCHAR(255),
  stop_url            NVARCHAR(255),
  location_type       NVARCHAR(2), # TfNSW extension
  parent_station      NVARCHAR(100), # TfNSW extension
  platform_code       NVARCHAR(50), # TfNSW extension
  stop_timezone       NVARCHAR(50),
  wheelchair_boarding TINYINT(1), # TfNSW extension
  KEY `zone_id` (zone_id),
  KEY `stop_lat` (stop_lat),
  KEY `stop_lon` (stop_lon),
  KEY `location_type` (location_type),
  KEY `parent_station` (parent_station)
);

CREATE TABLE `trips` (
  id                    INT(12)       NOT NULL PRIMARY KEY AUTO_INCREMENT,
  transit_system        NVARCHAR(50)  NOT NULL,
  route_id              NVARCHAR(100) NOT NULL,
  service_id            NVARCHAR(100) NOT NULL,
  trip_id               NVARCHAR(255),
  trip_headsign         NVARCHAR(255),
  trip_short_name       NVARCHAR(255),
  direction_id          TINYINT(1), #0 for one direction, 1 for another.
  block_id              NVARCHAR(11),
  shape_id              NVARCHAR(40),
  wheelchair_accessible TINYINT(1), #0 for no information, 1 for at
  # least one rider accommodated on wheel chair, 2 for no riders
  # accommodated.
  bikes_allowed         TINYINT(1), #0 for no information, 1 for at least
  # one bicycle accommodated, 2 for no bicycles accommodated
  trip_note_id          NVARCHAR(100), # TfNSW extension
  KEY `route_id` (route_id),
  KEY `service_id` (service_id),
  KEY `direction_id` (direction_id),
  KEY `block_id` (block_id),
  KEY `shape_id` (shape_id)
);

# not used by TfNSW
CREATE TABLE `transfers` (
  id                INT(12)      NOT NULL PRIMARY KEY AUTO_INCREMENT,
  transit_system    NVARCHAR(50) NOT NULL,
  from_stop_id      INT(100)     NOT NULL,
  to_stop_id        NVARCHAR(8)  NOT NULL,
  transfer_type     TINYINT(1)   NOT NULL,
  min_transfer_time NVARCHAR(100)
);

# not used by TfNSW
CREATE TABLE `fare_attributes` (
  id                INT(12)      NOT NULL PRIMARY KEY AUTO_INCREMENT,
  transit_system    NVARCHAR(50) NOT NULL,
  fare_id           NVARCHAR(100),
  price             NVARCHAR(50) NOT NULL,
  currency_type     NVARCHAR(50) NOT NULL,
  payment_method    TINYINT(1)   NOT NULL,
  transfers         TINYINT(1)   NOT NULL,
  transfer_duration NVARCHAR(10),
  exception_type    TINYINT(2)   NOT NULL,
  agency_id         INT(100),
  KEY `fare_id` (fare_id)
);

# not used by TfNSW
CREATE TABLE `fare_rules` (
  id             INT(12)      NOT NULL PRIMARY KEY AUTO_INCREMENT,
  transit_system NVARCHAR(50) NOT NULL,
  fare_id        NVARCHAR(100),
  route_id       NVARCHAR(100),
  origin_id      NVARCHAR(100),
  destination_id NVARCHAR(100),
  contains_id    NVARCHAR(100),
  KEY `fare_id` (fare_id),
  KEY `route_id` (route_id)
);

# not used by TfNSW
CREATE TABLE `feed_info` (
  id                  INT(12)       NOT NULL PRIMARY KEY AUTO_INCREMENT,
  transit_system      NVARCHAR(50)  NOT NULL,
  feed_publisher_name NVARCHAR(100),
  feed_publisher_url  NVARCHAR(255) NOT NULL,
  feed_lang           NVARCHAR(255) NOT NULL,
  feed_start_date     NVARCHAR(8),
  feed_end_date       NVARCHAR(8),
  feed_version        NVARCHAR(100)
);

# not used by TfNSW
CREATE TABLE `frequencies` (
  id             INT(12)       NOT NULL PRIMARY KEY AUTO_INCREMENT,
  transit_system NVARCHAR(50)  NOT NULL,
  trip_id        NVARCHAR(100) NOT NULL,
  start_time     NVARCHAR(8)   NOT NULL,
  end_time       NVARCHAR(8)   NOT NULL,
  headway_secs   NVARCHAR(100) NOT NULL,
  exact_times    TINYINT(1),
  KEY `trip_id` (trip_id)
);

