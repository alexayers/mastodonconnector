# Mastodon Connectors

A series of scripts to connect data from various services to Mastodon.

### PixelFed

* Create a personal access client by running this command on your server:
  * php artisan passport:client --personal
* Install node on your server (I'm using 20.5.0)
* Clone the repo to your server
* Run npm install from ./pixelfed
* Copy ./pixelfed/cfg/sample.config.json to ./pixelfed/cfg/config.json
* Update the values to be your PixelFed instance and your Mastodon instance
* Test by running: npm run sync. 
* Add this to your crontab
  * */1 * * * * sh /root/mastodonconnector/pixelfed/src/bash/sync.sh
