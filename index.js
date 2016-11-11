"use strict"

const await_for = require('./await_for')
const lives = require('./lives')
const f = require('./collect')

const print = msg => process.stdout.write(msg)
const c = f.collect

console.time('fetch')
Promise.all(
    c([lives[2]])
    .map(f.call)
    .map(c(5).gen_fill_closure(await_for))
    .collapse()
)
.then(f.collapse)
// .then(JSON.stringify)
.then(_=>console.info(_.length))
.then(_=>console.timeEnd('fetch'))
.catch(console.error)