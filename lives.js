"use strict"
var fetch = require('node-fetch')

module.exports = [
    function *() {
        const url = 'http://www.panda.tv/live_lists'
        const limit = 120
        let page = 0
        let page_count = 0

        const filter = (data) => {
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
            if (page_count && page > page_count) return

            yield fetch(`${url}?pageno=${++page}&pagenum=${limit}&order=person_num&status=2`)
                .then(_=>_.json())
                .then(filter)
        }
    }
]