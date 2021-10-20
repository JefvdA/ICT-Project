const express = require('express')
const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/api/files', function (req, res) {
    const fileName = req.body.fileName
    const fileContents = req.body.fileContents
    
    res.send({
        "fileName" : fileName,
        "fileContents" : fileContents
    })
})

app.get('/api/files', function(req, res) {
    res.send("GET request")
})

app.get('/', function(req, res) {
    res.send("TEST TEST")
})

app.listen(8080);