"use strict"
var request = require('request')

module.exports = [
    function *() {
        let url = 'http://www.panda.tv/live_lists'
        let max_thread = 1
        let page = 0
        let page_count = 0
        let result = []
        let limit = 120

        let filter = (data) => {
            data = parse(data)
            if(!data) {
                return []
            } 
            if(page_count  === 0) {
                page_count = Math.ceil(data.data.total/limit)
                console.log(`Panda total : ${data.data.total}`)
            }
            return data.data.items.map( (i) => ({
                platform : '熊猫',
                rid : i.id,
                room_name : i.name,
                user : i.userinfo.nickName,
                tag : i.classification.cname,
                num : i.person_num,
                cover : i.pictures.img,
                avatar : i.userinfo.avatar,
                url : `http://www.panda.tv/${i.id}`
            }))
        }

        while(1) {
            if( page_count > page || page_count === 0 ) {
                yield fetch(`${url}?pageno=${++page}&pagenum=${limit}&order=person_num&status=2`)
                .then(filter)
            }
            else return
        }
    }
]

function fetch(url) {
    let ms = Math.ceil(Math.random()*1000)
    return new Promise((resolve, reject) => {
        setTimeout(resolve, ms, url+'&time='+ms)
    })
}

function parse(str) {
    try {
        return JSON.parse(str)
    } catch(e) {
        return false
    }
}

// function fetch(url) {
//     return new Promise((resolve, reject) => {
//         request(url, (err, response, data) => {
//             console.log(url)
//             err ? reject(err) : resolve(data)
//         })
//     })
// }

