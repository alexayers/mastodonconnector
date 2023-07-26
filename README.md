# Mastodon Connectors

A series of scripts to connect data from various services to Mastodon.

### PixelFed

This script works by first attempting to find your most recent post using the public API. It then finds the file on the server itself for uploading to Mastodon using Mastodon's API.

Note: This assumes you're installing into root.
Note: This also assumes your pixelfed feed is public. It's using the public API without authentication.

On Mastodon Server

* Generate an app on your Mastodon instance and record the secrets

On PixelFed Server 

* Install node on your server (I'm using 20.5.0)
* Clone the repo to your server
* Run npm install from ./pixelfed
* Copy ./pixelfed/cfg/sample.config.json to ./pixelfed/cfg/config.json
* Update the values to be your PixelFed instance and your Mastodon instance
* Test by running: npm run sync.
* Add this to your crontab to run the sync every minute. It will only sync new items and assumes no one users is updating multiple times a minute (safe bet). Your paths will depend on your install path.
  * */1 * * * * /root/.nvm/versions/node/v20.5.0/bin/ts-node /root/mastodonconnector/pixelfed/src/app/main.ts > /root/mastodonconnector/pixelfed/sync.log 2>&1
* Check /root/mastodonconnector/pixelfed/sync.log for errors
