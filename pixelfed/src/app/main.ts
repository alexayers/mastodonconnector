import config from "../cfg/config.json";
import axios from 'axios';
import Mastodon from 'mastodon-api';
import * as fs from "fs";

(async () => {

    console.log("Running...");
    const PIXELFED_API = config.pixelFed.baseURL;
    const PIXELFED_STORAGE_ROOT = config.pixelFed.baseStorage;

    for (let accountIdx = 0; accountIdx < config.pixelFed.sync.length; accountIdx++) {
        const MASTODON_API = config.pixelFed.sync[accountIdx]["to"]["api"];
        const accountID = config.pixelFed.sync[accountIdx].from["account"];
        const response = await axios.get(`${PIXELFED_API}/${accountID}/statuses?limit=1`)
        const imageText = response.data[0]["content_text"];
        const imageURL = PIXELFED_STORAGE_ROOT + response.data[0]["media_attachments"][0]["url"].split("storage")[1];

        console.log(`Running for account ${accountID} fetching ${imageURL}`);

        const M = new Mastodon({
            client_secret: config.pixelFed.sync[accountIdx]["to"]["clientSecret"],
            client_key: config.pixelFed.sync[accountIdx]["to"]["clientKey"],
            access_token: config.pixelFed.sync[accountIdx]["to"]["accessToken"],
            timeout_ms: 60 * 1000,
            api_url: MASTODON_API
        });

        console.log(`Authenticated against Mastodon ${MASTODON_API}`);

        M.post('media', {file: fs.createReadStream(imageURL)}).then(resp => {
            const id = resp.data.id;

            fs.open(accountID,'r',function(err, fd){
                if (err) {
                    fs.writeFile(accountID, '-1', function(err) {
                        if(err) {
                            console.log(err);
                        }
                    });
                }
            });

            let contents = fs.readFileSync(accountID, {encoding: 'utf8', flag: 'r'});

            if (contents != id) {
                console.log(`Sending image with status ${imageText}`);

                M.post('statuses', {status: `${imageText} \nCross Posted from PixelFed :-)`, media_ids: [id]})
                fs.writeFileSync(accountID, id,{ encoding: 'utf8', flag: 'w' });
            } else {
                console.log("Skipping this post as it's already been cross posted");
            }
        });

        console.log(`Posted media`);
    }

})();

