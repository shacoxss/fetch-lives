"use strict"

function traversal(iterator) {
    let solve = []
    function _loop(resolve, reject) {
        let next = iterator.next()
        if(next.done) {
            resolve(solve)
        } else {
            next.value.then( data => {
                solve = solve.concat(data)
                _loop(resolve, reject)
            })
        }
    }
    return new Promise(_loop).then(_=>solve)
}

function threads_traversal( iterator, how ) {
    let promises = []
    let collapse = _=>_.reduce(
        (p, c)=> p.concat(c)
    )

    for(let i = 0; i < how; i++) {
        promises.push(traversal(iterator))
    }
    
    return Promise.all(promises).then(collapse)
}

module.exports = {
    threads_traversal : threads_traversal
}