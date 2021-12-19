const mysql = require('mysql')
const dotenv = require('dotenv')
dotenv.config()

exports.handler = (event) => {
    const pool = mysql.createConnection({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    port: process.env.RDS_PORT,
    database: process.env.RDS_DB
});
    var key = event.Records[0].s3.object.key
    var checksum = event.Records[0].s3.object.eTag
   

        let str = `update files set checksum = '${checksum}' where uuid = '${key}';`
        pool.query(str, (err) => {
            if (!err){
                pool.end()
                return 'Update succesfull'}
            else
                return err
        })
    
    const response = {
        statusCode: 200,
        body: "Succes",
    }
    return response
}