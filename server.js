const express = require('express')
const app = express()
const multer = require('multer');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
path = require("path");

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'Uploads')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
})

var upload = multer({ storage: storage })

app.get('/', (req, res) => {

    res.sendFile(path.join(__dirname, "upload.html"))
})

app.get('/api/files/:uuid', (req, res) => {

    res.download(path.join(__dirname, "Uploads/" + req.params.uuid));
})

app.post('/api/files', upload.single('myFile'), (req, res, next) => {
    const file = req.file
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send(file)

})
app.listen(3000, () => console.log('Server ready'))
