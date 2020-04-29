# Running with Docker

The steps to do so are:
- [Install Docker](https://docs.docker.com/get-docker/).
- Have a Docker user ready, note it's userid and groupid.
- Create the following directories:
    - These can be adjusted to anything, as long as you make sure the container volumes match.
    - `/home/myuser/docker/sharex/uploads` - This will contain all of your uploads (images, files, ...)
    - `/home/myuser/docker/mariadb/config` - This will be the volume for MariaDB configuration
    - `/home/myuser/docker/letsencrypt/config` - This will be the volume for letsencrypt/nginx/fail2ban configuration.

- Adjust the docker-compose file with the following:
    - **Userid and groupid of the services to your docker user**.
    - `letsencrypt`
        - `URL` - Domain you wish to use.
        - `PUID` - Userid of your Docker user.
        - `PGID` - Groupid of your Docker user.

    - `mariadb`
        - `PUID` - Userid of your Docker user.
        - `PGID` - Groupid of your Docker user.
        - `MYSQL_PASSWORD` - Choose a strong password.
        - `MYSQL_ROOT_PASSWORD` - Choose another strong password.

    - `sharex`
        - `DB_PASSWORD` - The password you chose for `MYSQL_PASSWORD` of `mariadb`.
        - `API_KEY` - This is your "password" to upload content to your server, choose something strong.

- Lastly, do the following for [`docker-share.my.domain.conf`](./docker-share.my.domain.conf):
    - Replace `server_name` directives with your (sub)domain.
    - Save it to `/home/myuser/docker/letsencrypt/config/nginx/site-confs/`.

- Run `docker-compose up -d`

---

## Images used
- [`linuxserver/letsencrypt`](https://hub.docker.com/r/linuxserver/letsencrypt/)

    Nginx webserver and reverse proxy with php support and a built-in letsencrypt client that automates free SSL server certificate generation and renewal processes. Also contains fail2ban for intrusion prevention.

- [`linuxserver/mariadb`](https://hub.docker.com/r/linuxserver/mariadb)

    MariaDB container with easy user and group mappings.

- [`busheezy/node-ts-sharex-api`](https://hub.docker.com/r/busheezy/node-ts-sharex-api)

    This project. All available environment variables can be found in the [.env.example](./.env.example) file.
