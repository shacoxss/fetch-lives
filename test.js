"use strict"

let p = require('./platform.js')
let async = require('./async_manage.js').threads_traversal


async(p[0](), 10).then(console.log)