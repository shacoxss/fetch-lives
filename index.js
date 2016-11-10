"use strict"

const await_for = require('./await_for')
const lives = require('./lives')
const f = require('./collect')

const print = msg => process.stdout.write(msg)
const c = f.collect

console.time('fetch')

c(lives)
.map(f.call)
.promise()
.then(console.log)
// .map(f.call)
// // .map(c(10).gen_fill_closure(await_for))
// // .collapse()
// .promise()
// .collapse()
// .then(JSON.stringify)
// // .then(print)
// .then(_=>console.timeEnd('fetch'))