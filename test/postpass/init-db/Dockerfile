FROM debian:trixie
WORKDIR /code
RUN apt-get update && apt-get install -y postgresql-client-common postgresql-client-17 git make cmake g++ libboost-dev libexpat1-dev zlib1g-dev libpotrace-dev libopencv-dev libbz2-dev libpq-dev libproj-dev lua5.3 liblua5.3-dev pandoc nlohmann-json3-dev pyosmium 
RUN rm -rf osm2pgsql postpass-ops
RUN git clone --depth=1 https://github.com/osm2pgsql-dev/osm2pgsql
WORKDIR /code/osm2pgsql
RUN mkdir build && cd build && cmake .. && make && make install
WORKDIR /code
RUN git clone https://github.com/woodpeck/postpass-ops
ADD data.osm.bz2 data.osm.bz2
ADD setup.sh setup.sh
CMD ./setup.sh
#RUN psql -h db -c "create user readonly with password 'readonly';"
#RUN psql -h db -c "grant usage on schema public to readonly;"
#RUN psql -h db -c "grant select on all tables in schema public to readonly ;"
#RUN psql -h db -c "alter default privileges in schema public grant select on tables to readonly;"
