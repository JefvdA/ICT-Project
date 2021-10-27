import express from 'express'
import * as path from 'path'
import * as fs from 'fs'
import upload from 'express-fileupload'
const __dirname = path.resolve()
    // const express = require('express')
const app = express()
    // const multer = require('multer');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(upload())
    // path = require("path");
    // const fs = require('fs');
import { PutObjectCommand } from "@aws-sdk/client-s3";

import { S3Client } from "@aws-sdk/client-s3";
// Set the AWS Region.
const REGION = "us-east-1"; //e.g. "us-east-1"
// Create an Amazon S3 service client object.
const s3Client = new S3Client({ region: REGION });

app.get('/', (req, res) => {

    res.sendFile(path.join(__dirname, "upload.html"))
})

app.get('/api/files/:uuid', (req, res) => {

    //checksum
    var dateCreated = fs.statSync(path.join(__dirname, "uploads/" + req.params.uuid)).birthtime;
    if (((new Date().getTime() - dateCreated.getTime()) / 60000) > 1440)
        res.send("24 hours have passed");
    else
        res.download(path.join(__dirname, "uploads/" + req.params.uuid));
    console.log((new Date().getTime() - dateCreated.getTime()) / 60000)

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