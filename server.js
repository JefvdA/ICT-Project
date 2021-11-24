import * as path from 'path'

import { DownloadFile, UploadFile } from './AWS/s3Functions.js'
import * as security from './security.js'
import express from 'express'
import fileUpload from 'express-fileupload'
const __dirname = path.resolve()
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(fileUpload())


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "pages/index.html"))
})
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, "pages/login.html"))
})

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, "pages/register.html"))
})

app.get('/api/files/:uuid', (req, res) => {
    const uuid = req.params.uuid

    DownloadFile(uuid).then((fileStream) => {
        res.attachment(uuid.split(":")[1]) // Get filename through UUID parameter -> Later replace this with filename gotten out of rds database
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

app.post('/api/register', (req, res) => {
    res.send(security.registerUser(req.body.myEmail, req.body.myPassword))
})

app.post('/api/login', (req, res) => {

    let output = security.login(req.body.myEmail, req.body.myPassword)
    output.then(
        function(value) {
            res.sendFile(path.join(__dirname, "pages/upload.html"))
        },
        function(error) {
            console.log(error)
            res.redirect(req.get('referer'));
        }
    );
})
app.listen(3000, () => console.log('Server ready'))