'use strict';

const koa = require('koa2');

const app = new koa();

app.use(function* (next) {
    if (this.request.url === '/') {
        console.log('node 111111111')
        this.body = 'node'
        return;
    } else if (this.request.url === '/a') {
        console.log('node AAAAAAAAA')
        this.body = 'node A'
        return;
    } else if (this.request.url === '/b') {
        console.log('node BBBBBBBB')
        this.body = 'node B'
        return;
    } else if (this.request.url === '/c') {
        console.log(this.request.req.headers['x-replaced-path'])
        console.log('node CCCCCCCC')
        this.body = 'node C'
        return;
    }
    yield next;
})

app.listen(3000, '0.0.0.0');
console.log('listening on port 3000');

module.exports = app;