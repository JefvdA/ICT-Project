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

export function FileName(uuid) {
    return new Promise((resolve, reject) => {
        let str = `select name from files where uuid = "${uuid}"`
        pool.query(str, (err, result) => {
            if (err) {
                return reject(error)
            }
            return resolve(result)
        })
    })
}

export async function GetFileName(uuid) {
    try {
        const result = await FileName(uuid)
        return result[0].name
    } catch (error) {
        return error
    }
}