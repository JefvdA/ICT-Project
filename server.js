import * as path from 'path'
import { GetFileName } from './rds.js'
import { DownloadFile, UploadFile } from './AWS/s3Functions.js'
import cookieParser from 'cookie-parser'
import * as security from './security.js'
import express from 'express'
import fileUpload from 'express-fileupload'
const __dirname = path.resolve()
const app = express()
app.use(cookieParser())

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(fileUpload())


app.get('/', (req, res) => {
    res.clearCookie("token");
    res.sendFile(path.join(__dirname, "pages/index.html"))
})
app.get('/login', (req, res) => {
    res.clearCookie("token");
    res.sendFile(path.join(__dirname, "pages/login.html"))
})

app.get('/upload', (req, res) => {
    security.validateToken(req.cookies.token).then(
        function(value) {
            res.sendFile(path.join(__dirname, "pages/upload.html"))
        },
        function(err) {
            console.log(err)
            res.send("Please sign in or register to upload")
            return err
        }
    )
})

app.get('/register', (req, res) => {
    res.clearCookie("token");
    res.sendFile(path.join(__dirname, "pages/register.html"))
})

app.get('/api/files/:uuid', (req, res) => {
    const uuid = req.params.uuid

    security.validateToken(req.cookies.token).then(
        function(value) {
            DownloadFile(uuid).then((fileStream) => {

                GetFileName(uuid).then(function test(params) {
                    res.attachment(params)
                    fileStream.pipe(res)
                }, function error(err) {
                    console.log(err)
                })
            })
        },
        function(err) {
            console.log(err)
            res.send("Please sign in or register to upload")
            return err
        }
    )

})

app.post('/api/files/', (req, res, next) => {
    const file = req.files.myFile
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
    security.validateToken(req.cookies.token).then(
        function(value) {
            console.log(value)
            var output = UploadFile(file)
            res.send(output)

        },
        function(err) {
            console.log(err)
            res.send("Please sign in or register to upload")
            return err
        }
    )
})

app.post('/api/register', (req, res) => {
    res.send(security.registerUser(req.body.myEmail, req.body.myPassword))
})

app.post('/api/login', (req, res, next) => {

    let output = security.login(req.body.myEmail, req.body.myPassword)
    output.then(
        function(value) {
            res.cookie("token", value.accessToken.jwtToken)
            res.redirect("/upload")
        },
        function(error) {
            console.log(error)
            res.redirect(req.get('referer'));
        }
    );

})
app.listen(3000, () => console.log('Server ready'))