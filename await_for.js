"use strict"

const await_for = iterator => {

    let solve = []
    let queue = [_=>solve.push(_)]

    const _loop = (resolve, reject) => {
        const {value : next, done} = iterator.next()

        const exec_queue = result => {
            for (let job of queue) {
                if (job instanceof Function) job(result)
            }
            _loop(resolve, reject)
        }

        if (done) return resolve(solve)
        
        next.then(exec_queue, reject)
    }
    
    const promise = new Promise(_loop)

    promise.of = (resolve) => {
        queue.push(resolve)
        return promise
    }

    return promise
}

function await_for_multi( iterator, how ) {
    // let promises = []

    // for(let i = 0; i < how; i++) {
    //     promises.push(await_for(iterator))
    // }
    let a = Array(10).fill().map(_=>await_for(iterator))
    return Promise.all(a)
}

module.exports = {
    await_for : await_for,
    await_for_multi : await_for_multi,
}