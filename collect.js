"use strict"

const util = require('util')

const collect = init => {
    return new Proxy(gen_store(init), {
        get : (target, prop, receiver) =>
            prop in f 
            ? (..._) => collect(f[prop](target, ..._))
            : util.isFunction(target[prop])
                ? (..._) => collect(target[prop](..._))
                : target[prop]
    })
}
const f = {
    collapse : cross => util.isArray(cross[0]) 
        ? f.collapse(cross.reduce(f.concat)) 
        : cross
    ,

    concat : (p, c) => p.concat(c),

    fill_closure : (target, f, ...arg) => target.fill().map(_=>f(...arg)),

    gen_fill_closure : (target, func) => (...arg)=> f.fill_closure(target, func, ...arg),

    call : _=>_(),

    promise : t => Promise.all(t).then(f.collapse),

    pipe : (t, f) => f(t),

    collect : collect,
}

const gen_store = init =>
    util.isArray(init)
        ? init : util.isNumber(init)
            ? Array(init) : [init]

const wrap = native => {
    
}

module.exports = f