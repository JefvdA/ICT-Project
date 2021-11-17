import * as path from 'path'
import * as fs from 'fs'

import { DownloadFile, UploadFile } from './AWS/s3Functions.js';
import * as security from './security.js'
const __dirname = path.resolve()
import express from 'express'
import fileUpload from 'express-fileupload';

let loggedIn = false

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(fileUpload())


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"))
})
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, "login.html"))
})

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, "register.html"))
})
app.get('/upload', (req, res) => {

    res.sendFile(path.join(__dirname, "upload.html"))
})

app.get('/api/files/:uuid', (req, res) => {
    const uuid = req.params.uuid

    DownloadFile(uuid).then((fileLocation) => {
        res.download(fileLocation, (err) => {
            if (err) throw err
            fs.unlinkSync(fileLocation)
        })
    })
})

app.post('/api/files', (req, res, next) => {

    const file = req.files.myFile
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }

    UploadFile(file)
})

app.post('/api/register', (req, res) => {
    res.send(security.registerUser(req.body.myEmail, req.body.myPassword))
})

app.post('/api/login', (req, res) => {

    let output = security.login(req.body.myEmail, req.body.myPassword)
    output.then(
        function(value) {
            res.sendFile(path.join(__dirname, "upload.html"))
        },
        function(error) { console.log(error) }
    );
})
app.listen(3000, () => console.log('Server ready'))