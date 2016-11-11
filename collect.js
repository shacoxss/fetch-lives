"use strict"

const util = require('util')

const collect = init => 
    new Proxy(gen_store(init), {

        get : (target, prop, receiver) =>
            prop in f 
            ? (..._) => collect(f[prop](target, ..._))
            : util.isFunction(target[prop])
                ? (..._) => collect(target[prop](..._))
                : target[prop]
    
    })

const f = {
    collapse : cross => util.isArray(cross[0]) 
        ? f.collapse(cross.reduce(f.concat)) 
        : cross
    ,

    concat : (p, c) => p.concat(c),

    unique : (t, col) => {
        let temp = []

        return t.filter(_=> {
            if (_[col] && temp.indexOf(_[col]) === -1) {
                temp.push(_[col])
                return true
            }
        })
    },

    fill_closure : (target, f, ...arg) => target.fill().map(_=>f(...arg)),

    gen_fill_closure : (target, func) => (...arg)=> f.fill_closure(target, func, ...arg),

    call : _=>_(),

    pluck : (t, key) => t.map(_=>_[key]),

    pipe : (t, f) => f(t),

    collect : collect,
}

const gen_store = init => 
    util.isArray(init)
    ? init : util.isNumber(init)
    ? Array(init) : wrap(init)

const wrap = native => {
    if (native instanceof Object) return native

    if (typeof native === 'string') return new String(native)
}

module.exports = f