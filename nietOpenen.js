import { ListBucketsCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import express from 'express'
import * as path from 'path'
import * as fs from 'fs'
import upload from 'express-fileupload'
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { S3Client } from "@aws-sdk/client-s3";
const __dirname = path.resolve()
const app = express()
const REGION = "us-east-1";
const s3Client = new S3Client({ region: REGION });
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(upload())

app.get('/', (req, res) => {

    res.sendFile(path.join(__dirname, "upload.html"))
})

app.get('/api/files/:uuid', (req, res) => {

    //checksum
    // Upload file to specified bucket.
    const run = async() => {
        try {
            const data = await s3Client.send(new ListBucketsCommand({}));
            const data2 = await s3Client.send(new GetObjectCommand({ Bucket: "saadiandco", Key: path.basename(req.params.uuid) }));
            console.log(data2)
            res.send(data.Buckets)
                // For unit tests.
        } catch (err) {
            res.send(err)
            console.log("Error", err);
        }
    };
    run();
})

app.post('/api/files', (req, res) => {
    const uploadParams = {
        Bucket: "saadiandco",
        // Add the required 'Key' parameter using the 'path' module.
        Key: path.basename(req.files.myFile.name),
        // Add the required 'Body' parameter
        Body: req.files.myFile.data,
    };


    // Upload file to specified bucket.
    const run = async() => {
        try {
            const data = await s3Client.send(new PutObjectCommand(uploadParams));
            console.log("Success", data);
            res.send(req.files.myFile.name + " has been uploaded")
            return data; // For unit tests.
        } catch (err) {
            res.send(err)
            console.log("Error", err);
        }
    };
    run();
})
app.listen(3000, () => console.log('Server ready'))