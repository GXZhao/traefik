'use strict';

const koa = require('koa2');

const app = new koa();

app.use(function* (next) {
    if (this.request.url === '/') {
        console.log('nodedev 11111111')
        this.body = 'nodedev'
        return;
    } else if (this.request.url === '/a') {
        console.log('nodedev AAAAAAAA')
        this.body = 'nodedev A'
        return;
    } else if (this.request.url === '/b') {
        console.log('nodedev BBBBBBBB')
        this.body = 'nodedev B'
        return;
    } else if (this.request.url === '/c') {
        console.log('nodedev CCCCCCCC')
        this.body = 'nodedev C'
        return;
    }
    yield next;
})

app.listen(2000, '0.0.0.0');
console.log('listening on port 2000');

module.exports = app;
