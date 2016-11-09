"use strict"
var request = require('request')

module.exports = [
    function *() {
        let url = 'http://www.panda.tv/live_lists'
        let page = 0
        let page_count = 0
        let limit = 120

        let filter = (data) => {
            data = parse(data)
            if(!data) {
                return []
            }
            if(page_count  === 0) {
                page_count = Math.ceil(data.data.total/limit)
            }
            return data.data.items.map( i => ({
                live_id : 1,
                room_name : i.name,
                live_user_id : 'p_' + i.userinfo.rid,
                name : i.userinfo.nickName,
                online : i.person_num,
                cover : i.pictures.img,
                avatar : i.userinfo.avatar,
                url : `http://www.panda.tv/${i.id}`,
                category_name : i.classification.cname,
                category_url : "http://www.panda.tv/cate/" + i.classification.ename,
                category_id : 'p_' + i.classification.ename,
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

function parse(str) {
    try {
        return JSON.parse(str)
    } catch(e) {
        return false
    }
}

function fetch(url) {
    return new Promise((resolve, reject) => {
        request(url, (err, response, data) => {
            err ? reject(err) : resolve(data)
        })
    })
}

