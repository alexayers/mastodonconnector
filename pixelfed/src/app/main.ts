import config from "../cfg/config.json";
import axios from 'axios';
import Mastodon from 'mastodon-api';
import * as fs from "fs";

(async () => {

    const PIXELFED_API = config.pixelFed.baseURL;
    const PIXELFED_STORAGE_ROOT = config.pixelFed.baseStorage;

    const MASTODON_API = config.pixelFed.sync[0]["to"]["api"];
    let accountID = config.pixelFed.sync[0].from["account"];
    const response = await axios.get(`${PIXELFED_API}/${accountID}/statuses?limit=1`)
    let imageText = response.data[0]["content_text"];
    let imageURL = PIXELFED_STORAGE_ROOT + response.data[0]["media_attachments"][0]["url"].split("storage")[1];

    const M = new Mastodon({
        client_secret: config.pixelFed.sync[0]["to"]["clientSecret"],
        client_key: config.pixelFed.sync[0]["to"]["clientKey"],
        access_token: config.pixelFed.sync[0]["to"]["accessToken"],
        timeout_ms: 60 * 1000,
        api_url: MASTODON_API
    });

    M.post('media', {file: fs.createReadStream(imageURL)}).then(resp => {
        const id = resp.data.id;
        M.post('statuses', {status: imageText, media_ids: [id]})
    });

})()

