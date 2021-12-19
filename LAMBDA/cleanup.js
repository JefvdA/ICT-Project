const mysql = require('mysql')
const dotenv = require('dotenv')
dotenv.config()

exports.handler = (event) => {
    // TODO implement
    const pool = mysql.createConnection({
        host: process.env.RDS_HOSTNAME,
        user: process.env.RDS_USERNAME,
        password: process.env.RDS_PASSWORD,
        port: process.env.RDS_PORT,
        database: process.env.RDS_DB
    });
    
    let uuid = event.Records[0].s3.object.key
    let str = `DELETE FROM files WHERE uuid='${uuid}';`
    
    console.log("query: " + str)

    pool.query(str, (err, rows) => {
        if (!err) {
            console.log(rows)
            pool.end()
            return rows
        } else
            return err
    })

    const response = {
        statusCode: 200,
        body: "Succes",
    };
    return response;
};