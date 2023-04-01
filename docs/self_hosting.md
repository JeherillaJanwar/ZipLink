# Self Host ZipLink

## Requirements

-   Mandatory: [Node.js](https://nodejs.org/en/) at least 16x (`16.15.1 LTS`) & NPM
-   Mandatory: Your domain name, example: `your.domain.name`

---

Install the requirements (Note: Many of the installation steps require `root` or `sudo` access)

```bash
# Install NodeJS 16.X and npm
$ sudo apt update
$ sudo apt -y install curl dirmngr apt-transport-https lsb-release ca-certificates
$ curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash -
$ sudo apt-get install -y nodejs
$ npm install -g npm@latest
```

---

```bash
# clone this repo
$ git clone https://github.com/JeherillaJanwar/ZipLink.git
# go to ZipLink dir
$ cd ZipLink
# copy .env.template to .env (edit it according to your needs)
$ cp .env.template .env
```

Now, go to `.env` file and change the MONGO URL & DATABASE, with your own:

```bash
mongo_url = mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}
DB = ZipLink # Database Name
```


```bash
# Install dependencies
$ npm install
# Start the server
$ npm start
```

-   Open http://localhost:8080 in your DEFAULT browser

---

# PM2

Using [PM2](https://pm2.keymetrics.io)

```bash
# Install pm2
$ npm install -g pm2
# Start the server
$ pm2 start app/server.js
# Takes a snapshot
$ pm2 save
# Add it on startup
$ pm2 startup
```

---


