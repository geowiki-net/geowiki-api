#!/bin/sh
DB=postgresql://osm:secure_password@db/osm
psql $DB -c "CREATE EXTENSION postgis;"
osm2pgsql -d $DB -O flex -S postpass-ops/postpass.lua data.osm.bz2

psql $DB -c "create user readonly with password 'readonly';"
psql $DB -c "grant usage on schema public to readonly;"
psql $DB -c "grant select on all tables in schema public to readonly ;"
psql $DB -c "alter default privileges in schema public grant select on tables to readonly;"
