import * as path from 'path'
import * as fs from 'fs'

import { DownloadFile, UploadFile } from './AWS/s3Functions.js'

import express from 'express'
import fileUpload from 'express-fileupload'
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(fileUpload())


app.get('/', (req, res) => {
    res.sendFile(path.join(path.resolve(), "upload.html"))
})

app.get('/api/files/:uuid', (req, res) => {
    const uuid = req.params.uuid

    DownloadFile(uuid).then((fileStream) =>{
        res.attachment(uuid.split("_")[1]) // Get filename through UUID parameter -> Later replace this with filename gotten out of rds database
        fileStream.pipe(res)
    })
})

app.post('/api/files', (req, res, next) => {
    const file = req.files.myFile
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }

    var output = UploadFile(file)
    res.send(output)
})

app.listen(3000, () => console.log('Server ready'))