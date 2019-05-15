const assert = require('assert');
const index = require("../index")

describe('idnex', function () {
    describe('handler', function () {
        it('should be called', function () {
            const req = {
                body: {}
            }
            const res = {
                send: (content) => { console.log(content); assert.ok(content) }
            }
            index.handler(req, res)
        });
    });
});