"use strict"

const await_for = require('./await_for').await_for
const lives = require('./lives').map(_=>_())

const async = num => generate => await_for(generate() ,num)
const print = msg => process.stdout.write(msg)
const fill = (f, many) => Array(many).fill().map(f)

const collapse = _=>{
    while (_[0] instanceof Array) {
        _ = _.reduce((p, c) => p.concat(c))
    }
    return _
}
Promise.all(
    collapse(lives.map(
        live => fill(_=>await_for(live), 10)
    ))
)
.then(collapse)
.then(_=>print(_.length+''))
// .then(JSON.stringify)
// .then(console.log)