FROM mysql:latest

# allow us to LOAD DATA INFILE from anywhere, for convenience
COPY ./loadanyfile.cnf /etc/mysql/conf.d/

ENV MYSQL_DATABASE=gtfs1

# initialise the tables for basic GTFS import
COPY ./gtfs_schema.sql /docker-entrypoint-initdb.d/
