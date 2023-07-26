import config from "../cfg/config.json";
import axios, {AxiosResponse} from 'axios';
import Mastodon from 'mastodon-api';
import * as fs from "fs";

(async () => {

    console.log("Running...");
    const PIXELFED_API : string = config.pixelFed.baseURL;
    const PIXELFED_STORAGE_ROOT : string = config.pixelFed.baseStorage;
    const ROOT_DIR : string = config.pixelFed.rootDir;

    for (let accountIdx : number = 0; accountIdx < config.pixelFed.sync.length; accountIdx++) {

        const MASTODON_API : string = config.pixelFed.sync[accountIdx]["to"]["api"];
        const accountID : string = config.pixelFed.sync[accountIdx].from["account"];
        const response : AxiosResponse<any,any> = await axios.get(`${PIXELFED_API}/${accountID}/statuses?limit=1`)
        const imageText = response.data[0]["content_text"];
        const imageURL : string = PIXELFED_STORAGE_ROOT + response.data[0]["media_attachments"][0]["url"].split("storage")[1];

        fs.open(`${ROOT_DIR}/${accountID}`,'r',function(err, fd){
            if (err) {
                fs.writeFile(accountID, '-1', function(err) {
                    if(err) {
                        console.log(err);
                    }
                });
            }
        });

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

            let contents: string = fs.readFileSync(accountID, {encoding: 'utf8', flag: 'r'});

            if (contents != imageURL) {
                console.log(`Sending image with status ${imageText}`);

                M.post('statuses', {status: `${imageText} \nCross Posted from PixelFed :-)`, media_ids: [id]})
                fs.writeFileSync(`${ROOT_DIR}/${accountID}`, imageURL,{ encoding: 'utf8', flag: 'w' });
                console.log(`Posted media`);
            } else {
                console.log("Skipping this post as it's already been cross posted");
            }
        });


    }

})();

