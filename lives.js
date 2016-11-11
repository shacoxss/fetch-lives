"use strict"
var fetch = require('node-fetch')

module.exports = [
    function *() {
        const url = 'http://www.panda.tv/live_lists'
        const limit = 120
        let page = 0
        let page_count = 0

        const format = (data) => {
            if(page_count  === 0) {
                page_count = Math.ceil(data.data.total/limit)
            }
            return data.data.items.map( i => ({
                live_id : 1,
                room_name : i.name,
                id : 'p_' + i.userinfo.rid,
                room_id :i.id,
                name : i.userinfo.nickName,
                online : i.person_num,
                cover : i.pictures.img,
                avatar : i.userinfo.avatar,
                url : `http://www.panda.tv/${i.id}`,
                category_name : i.classification.cname,
                category_url : "http://www.panda.tv/cate/" + i.classification.ename,
                category_id : i.classification.ename,
            }))
        }

        while(1) {
            if (page_count && page > page_count) return

            yield fetch(`${url}?pageno=${++page}&pagenum=${limit}&order=person_num&status=2`)
                .then(_=>_.json())
                .then(format)
        }
    },

    function* () {
        const url = 'http://open.douyucdn.cn/api/RoomApi/live'
        const limit = 100
        let page = 0
        let done = false

        const format = result => {
            const data = result.data
            if (data.length === 0) return done = true
            
            return data.map( i => ({
                live_id : 2,
                name : i.nickname,
                room_name : i.room_name,
                room_id : i.room_id,
                online : i.online,
                id : 'd_' + i.owner_uid,
                url : i.url,
                cover : i.room_src,
                avatar : i.avatar,
                category_id : i.cate_id,
                category_name : i.game_name,
                category_url : i.game_url,
            }))
        }

        while (!done)
            yield fetch(`${url}?offset=${page++*100}&limit=${limit}`)
            .then(_=>_.json())
            .then(format)
    },

    function *() {
        const url = 'http://www.quanmin.tv/json/play/list'
        let page = 0
        let page_count = 0

        const format = result => {
            if (page_count === 0) page_count = result.pageCount
            
            return result.data.map( i => ({
                live_id : 3,
                name : i.nick,
                room_name : i.title,
                room_id : i.uid,
                online : i.view,
                id : 'q_' + i.uid,
                url : `http://www.quanmin.tv/v/${i.slug ? i.slug : i.uid}`,
                cover : i.thumb,
                avatar : i.avatar,
                category_id : i.category_id,
                category_name : i.category_name,
                category_url : `http://www.quanmin.tv/game/${i.category_slug}`,
            }))
        }

        while (!page_count || page < page_count) {
            yield fetch(`${url}${page++ ? `_${page}` : ''}.json`)
            .then(_=>_.json())
            .then(format)
        }
    }
]