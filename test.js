"use strict"

let p = require('./platform.js')
let async = require('./async_manage.js')
var restify = require('restify')

var server = restify.createServer({
    name: 'myapp',
    version: '1.0.0'
})
server.use(restify.acceptParser(server.acceptable))
server.use(restify.queryParser())
server.use(restify.bodyParser())

server.get('/test', function (req, res, next) {
    api().then(
        data => res.send(data)
    )
    return next()
})

server.listen(8888, function () {
    console.log('%s listening at %s', server.name, server.url)
})
