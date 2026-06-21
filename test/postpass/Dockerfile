FROM debian:trixie
WORKDIR /code
RUN apt-get update && apt-get install -y golang-go git
RUN git clone https://github.com/woodpeck/postpass
WORKDIR /code/postpass
ADD config.go postpass/config.go
RUN go build -o postpass-server cmd/postpass/main.go
CMD ./postpass-server --Host=1.1.1.1
