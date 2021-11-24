import express from 'express'
import mysql from 'mysql'
import dotenv from 'dotenv'
dotenv.config()
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

var pool = mysql.createConnection({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DB
});

export function Upload(fileName, Uuid) {
    pool.connect((err, connection) => { //om naar pool te connecteren
        if (err)
            throw err

        console.log(`connected as id ${connection.id}`)

        let str = `insert into files (name, uuid) values ("${fileName}","${Uuid}")`
        pool.query(str, (err, rows) => { //je krijgt een error of rijen terug

            if (!err)
                return rows
            else
                return err
        })
    })
}