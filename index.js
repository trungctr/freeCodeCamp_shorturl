require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { request } = require('express');
const app = express();
const bodyPaser = require('body-parser');
const file = require('fs')

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyPaser.urlencoded({ extended: false }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

//[POST]/api/shorturl
app.post('/api/shorturl/', function(req, res) {
  let url = req.body.url
  let er = { error: 'invalid url' }
  let http = url.indexOf('http')
  let dot = url.indexOf('.')
  let data = JSON.parse(file.readFileSync('./fakeDB.json','utf8'))
  console.log(data)
  if(http !== 0){
    res.json(er)
    console.log('check 1')
    return
  }
  if(dot === -1){
    res.json(er)
    console.log('check 2')
    return
  }
  if(data){
    const id = data.maxIndex + 1
    const newRecord = { original_url : url, short_url : id}
    data.maxIndex = id
    data[String(id)] = newRecord
    let write = JSON.stringify(data)
    file.writeFile('./fakeDB.json',write,
    function (err) {
      if (err) throw err
      res.json(newRecord)
    }) 
  }
});

//[GET]/api/shorturl/:number
app.get('/api/shorturl/:number', function(req, res) {
  if(req.params.number){
    let data = JSON.parse(file.readFileSync('./fakeDB.json','utf8'))
    let url = data[req.params.number].original_url
    res.redirect(url)
    return
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
