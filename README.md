# Mastodon Connectors

A series of scripts to connect data from various services to Mastodon.

### PixelFed

Note: This assumes you're installing into root.

* Create a personal access client by running this command on your server:
  * php artisan passport:client --personal
* Install node on your server (I'm using 20.5.0)
* Clone the repo to your server
* Run npm install from ./pixelfed
* Copy ./pixelfed/cfg/sample.config.json to ./pixelfed/cfg/config.json
* Update the values to be your PixelFed instance and your Mastodon instance
* Test by running: npm run sync.
* Add this to your crontab to run the sync every minute. It will only sync new items and assumes no one users is updating multiple times a minute (safe bet)
  * */1 * * * * sh /root/mastodonconnector/pixelfed/sync.sh > /root/mastodonconnector/pixelfed/sync.log 2>&1
* Check /root/mastodonconnector/pixelfed/sync.log for errors
