const { Storage } = require('@google-cloud/storage');
const axios = require("axios")

const storage = new Storage();
const bucketName = process.env.BUCKET_NAME
console.log(`bucketName: ${bucketName}`)

const getJson = async (bucketName, fileName) => {
    return new Promise((resolve, reject) => {
        var stream = storage.bucket(bucketName).file(fileName).createReadStream();
        var buf = '';
        stream.on('data', function (d) {
            buf += d;
        }).on('end', function () {
            resolve(JSON.parse(buf))
        });
    })
}

/**
 * HTTP Cloud Function.
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
exports.handler = async function handler(req, res) {

    const options = {
        // The path to which the file should be downloaded, e.g. "./file.txt"
        destination: "./rss_webhooks.json",
    };

    config = await getJson(bucketName, "rss_webhooks.json")
    res.send(`config: ${JSON.stringify(config)}`);
};
