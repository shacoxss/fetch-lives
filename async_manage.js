"use strict"

function traversal( iterator, filter) {
    let solve = []
    if( !filter ) {
        filter = data => data
    }

    function _loop(resolve, reject) {
        let next = iterator.next()
        if(next.done) {
            resolve(solve)
        } else {
            next.value.then( data => {
                solve.push(filter(data))
                _loop(resolve, reject)
            })
        }
    }

    return new Promise(_loop)
}

function threads_traversal( iterator, how, filter ) {
    let solve = []
    let promises = []
    if( !filter ) {
        filter = data => data
    }

    for(let i = 0; i < how; i++) {
        promises.push(
            traversal(
                iterator, data => solve.push(filter(data))
            )
        )
    }

    return Promise.all(promises).then(()=> solve)
}

module.exports = {
    traversal : traversal,
    threads_traversal : threads_traversal
}