const { Storage } = require('@google-cloud/storage');
const FeedParser = require('feedparser');
const request = require("request")

const storage = new Storage();
const bucketName = process.env.BUCKET_NAME
console.log(`bucketName: ${bucketName}`)

const fs = require("fs");

const getJson = async (bucketName, fileName) => {
    return new Promise((resolve, reject) => {
        const stream = storage.bucket(bucketName).file(fileName).createReadStream();
        var buf = '';
        stream.on('data', function (d) {
            buf += d;
        }).on('end', function () {
            resolve(JSON.parse(buf))
        });
    })
}

// example from: https://github.com/danmactough/node-feedparser/blob/master/examples/compressed.js
const getLatestPosts = async (rssUrl, epoc) => {
    console.log(`rss url: ${rssUrl}`)

    const feedparser = new FeedParser();
    const posts = []

    return new Promise((resolve, reject) => {
        const req = request(rssUrl)
        req.on("error", err => { reject(err); return })
        req.on("response", (res) => {
            if (res.statusCode != 200) {
                reject(`Error: Bad status code ${res.statusCode}`); return
            }
            const encoding = res.headers['content-encoding'] || 'identity', charset = getParams(res.headers['content-type'] || '').charset;
            res = maybeDecompress(res, encoding);
            res = maybeTranslate(res, charset);
            res.pipe(feedparser);
        })

        feedparser.on("error", err => { reject(err); return })
        feedparser.on('readable', function () {
            var post;
            while (post = this.read()) {
                try {
                    if (Date.parse(post.date) > epoc) {
                        posts.push(post)
                    }
                } catch (e) {
                    console.log(e);
                    reject(e); return
                }
            }
        })
        feedparser.on('end', function () {
            resolve(posts)
        })
    })
}

function maybeDecompress(res, encoding) {
    var decompress;
    if (encoding.match(/\bdeflate\b/)) {
        decompress = zlib.createInflate();
    } else if (encoding.match(/\bgzip\b/)) {
        decompress = zlib.createGunzip();
    }
    return decompress ? res.pipe(decompress) : res;
}

function maybeTranslate(res, charset) {
    var iconv;
    // Use iconv if its not utf8 already.
    if (!iconv && charset && !/utf-*8/i.test(charset)) {
        try {
            iconv = new Iconv(charset, 'utf-8');
            console.log('Converting from charset %s to utf-8', charset);
            iconv.on('error', done);
            // If we're using iconv, stream will be the output of iconv
            // otherwise it will remain the output of request
            res = res.pipe(iconv);
        } catch (err) {
            res.emit('error', err);
        }
    }
    return res;
}

function getParams(str) {
    var params = str.split(';').reduce(function (params, param) {
        var parts = param.split('=').map(function (part) { return part.trim(); });
        if (parts.length === 2) {
            params[parts[0]] = parts[1];
        }
        return params;
    }, {});
    return params;
}

const requestPromise = async (webhook_url, json) => {
    const options = {
        url: webhook_url,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        json: json
    }

    return new Promise((resolve, reject) => {
        request(options, (err, res, body) => {
            if (body) {
                resolve(body); return
            }
            if (err) {
                reject(err); return
            }
        })
    })
}

const rssToDiscord = (post) => {
    return { content: `${post.title}\r${post.link}` }
}

/**
 * Background Cloud Function to be triggered by Pub/Sub.
 *
 * @param {object} event The Cloud Functions event.
 * @param {function} callback The callback function.
 */
exports.handler = async (event) => {
    const dt = new Date()
    dt.setHours(dt.getHours() - 3);
    console.log(`published after: ${dt}`)

    const config = await getJson(bucketName, "rss_webhooks.json")
    console.log(`config: ${JSON.stringify(config)}`);

    await config.forEach(async subscription => {
        const posts = await getLatestPosts(subscription.rss, dt.getTime())
        // fs.writeFileSync(`.local/${subscription.label}.json`, JSON.stringify(posts));
        await posts.forEach(async post => {
            await requestPromise(subscription.webhook, rssToDiscord(post))
        })
    });

    return
};