const rss_webhooks = require("./assets/rss_webhooks")
const axios = require("axios")

/**
 * HTTP Cloud Function.
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
exports.handler = function handler(req, res) {
    rss_webhooks.forEach(subscription => {
        const rss = subscription.rss
        console.log(rss)
    });
    res.send(`Hello ${req.body.name || 'World'}!`);
};
