const multer = require('multer')
const path = require("path")
const fs = require('fs')

const express = require('express')
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'Uploads')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname.replaceAll(" ", "_"))
    }
})

var upload = multer({ storage: storage })

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "upload.html"))
})

app.get('/api/files/:uuid', (req, res) => {
    //checksum
    var dateCreated = fs.statSync(path.join(__dirname, "Uploads/" + req.params.uuid)).birthtime;
    if (((new Date().getTime() - dateCreated.getTime()) / 60000) > 1440)
        res.send("24 hours have passed")
    else
        res.download(path.join(__dirname, "Uploads/" + req.params.uuid))
    console.log((new Date().getTime() - dateCreated.getTime()) / 60000)

})

app.post('/api/files', upload.single('myFile'), (req, res, next) => {
    const file = req.file
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
     res.send(file.originalname.replaceAll(" ", "_") + " has been uploaded")
})

app.listen(3000, () => console.log('Server ready'))