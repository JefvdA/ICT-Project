import * as path from 'path'
import { GetFileName } from './rds.js'
import { DownloadFile, UploadFile } from './AWS/s3Functions.js'
import * as security from './security.js'
import express from 'express'
import fileUpload from 'express-fileupload'
const __dirname = path.resolve()
const app = express()

let upload = (token) => { return `
<head>
    <meta charset="UTF-8">
    <title>MY APP</title>
</head>

<body>
    <!--  SINGLE FILE -->
    <form action="/api/files/${token}" enctype="multipart/form-data" method="POST">
        <input type="file" name="myFile" />
        <input type="submit" value="Upload a file" />
    </form>
</body>

</html>` }
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
app.get('/upload/:token', (req, res) => {
    res.sendFile(path.join(__dirname, "pages/upload.html"))
})
app.get('/api/files/:uuid', (req, res) => {
    const uuid = req.params.uuid

    DownloadFile(uuid).then((fileStream) => {

        GetFileName(uuid).then(function test(params) {
            res.send(params)
        }, function error(err) {
            console.log(err)
        })
        res.attachment(uuid.split(":")[1]) // Get filename through UUID parameter -> Later replace this with filename gotten out of rds database
        fileStream.pipe(res)
    })
})

app.post('/api/files/:token', (req, res, next) => {
    const file = req.files.myFile
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
    security.validateToken(req.params.token).then(
        function(value) {
            console.log(value)
            var output = UploadFile(file)
            res.send(output)

        },
        function(err) {
            console.log(err)
            return err
        }
    )
    res.send("dsfqsd")
})

app.post('/api/register', (req, res) => {
    res.send(security.registerUser(req.body.myEmail, req.body.myPassword))
})

app.post('/api/login', (req, res, next) => {
    let output = security.login(req.body.myEmail, req.body.myPassword)
    output.then(
        function(value) {
            res.send(upload(value.accessToken.jwtToken))
        },
        function(error) {
            console.log(error)
            res.redirect(req.get('referer'));
        }
    );

})
app.listen(3000, () => console.log('Server ready'))