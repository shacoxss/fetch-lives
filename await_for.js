"use strict"

module.exports = iterator => {

    let solve = []
    let queue = []

    const _loop = (resolve, reject) => {
        const {value : next, done} = iterator.next()

        const exec_queue = result => {
            for (let job of queue) {
                if (job instanceof Function) result = job(result)
            }
            solve.push(result)
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