"use strict"

const await_for = require('./await_for')
const lives = require('./lives')
const f = require('./collect')
const mysql = require('mysql')

const print = msg => process.stdout.write(msg)
const c = f.collect
const con = mysql.createConnection({
    host : '192.168.5.129',
    user : 'root',
    password : 'root',
    database : 'tag'
})

const cols = ['id','live_id','room_id','category_id','name','room_name','url','avatar','cover','online']

con.connect()
console.time('fetch')
Promise.all(
    c(lives)
    .map(f.call)
    .map(c(10).gen_fill_closure(await_for))
    .collapse()
)
.then(f.collapse)
.then(_=>f.unique(_, 'id'))
.then( data => {
    const table = 'qyg_anchors'
    const ids = `("${f.pluck(data, 'id').join('","')}")`

    const needle_sql = `SELECT id FROM ${table} WHERE id IN ${ids} AND status=0`

    const delete_sql = `DELETE FROM ${table} WHERE id IN ${ids}`

    const update_sql = `UPDATE ${table} SET status=0`

    const insert_sql = `INSERT INTO ${table} (${cols.join(',')},status) VALUES ${
        data.map( row => `(${cols.map( col => `'${row[col]}'`).join(',')},1)` ).join(',')
    }`

    con.query(needle_sql, (err, rows) => {
        if (err) throw err

        //循环发送通知

        con.query(delete_sql, err => {
            if (err) throw err
            con.query(update_sql, err => {
                if (err) throw err
                con.query(insert_sql, err => {
                    if (err) throw err
                    con.end()   
                    console.timeEnd('fetch')
                })
            })
        })
    })
})
// .then(JSON.stringify)
// .then(_=>console.info(_.length))
// .then(_=>console.timeEnd('fetch'))
.catch(console.error)
.catch(con.end)