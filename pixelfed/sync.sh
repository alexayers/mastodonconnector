#!/bin/sh

PATH=$PATH:/root/.nvm/versions/node/v20.5.0/bin/npm
cd /root/mastodonconnector/pixelfed
npm run sync
