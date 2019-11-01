# Docker commands

*Edit `.env` with necessary config (example in `.env.example`)*

If you want to access **host database** from docker container, the ip should be your docker interface ip, usually `172.17.0.1`

## Dockerfile

```sh
docker build -t sharexapi:latest .
docker run -it -v ./uploads:/app/uploads -v ./public/app/public -e API_KEY=hunter1 -p 3000:3000 sharexapi:latest
```

Setup nginx (reference [nginx.conf](./nginx.conf))

## docker-compose

```sh
# If you want to setup the api and db within docker containers
docker-compose up
```
