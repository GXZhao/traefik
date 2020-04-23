'use strict';

const koa = require('koa2');

const app = new koa();

app.use(function* (next) {
    if (this.request.url === '/') {
        console.log('NONONONO')
        this.body = 'NO'
        return;
    } else if (this.request.url === '/a') {
        console.log('AAAAAAAA')
        this.body = 'A'
        return;
    } else if (this.request.url === '/b') {
        console.log('BBBBBBBB')
        this.body = 'B'
        return;
    } else if (this.request.url === '/c') {
        console.log('CCCCCCCC')
        this.body = 'C'
        return;
    }
    yield next;
})

app.listen(process.env.PORT || 3690, '0.0.0.0');
console.log('listening on port 3690');

module.exports = app;