const express = require('express');
const app = express();
var router = express.Router();
const fs = require('fs')
var bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: false
}));
// serve files from the public directory
app.use(express.static('public'));

// start the express web server listening on 8080
app.listen(process.env.PORT, () => {
  console.log('listening on ' + process.env.PORT);
});

// serve the homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

let jsonFile = 'Artists.json';

app.get('/json', (req, res) => {
  fs.readFile(jsonFile, function (err, data) {
    res.json(JSON.parse(data))
  });
});

app.post('/store', (req, res) => {
  var artist = req.body;
  var element =  JSON.parse(JSON.stringify(artist));
  fs.readFile(jsonFile, function (err, data) {
    var json = JSON.parse(data)
    json.push(element)
    for(var ArtistObj in json){
      console.log(ArtistObj+": "+json[ArtistObj].Name);
    }
    fs.writeFile(jsonFile, JSON.stringify(json, null, 4), function(err, result) {
      if(err) console.log('error', err);
    });
  })
});

app.post('/search', (req, res) => {
  var artist = req.body;
  var element =  JSON.parse(JSON.stringify(artist));   
  fs.readFile(jsonFile, function (err, data) {
    var json = JSON.parse(data)
    var array = [];
    for(var ArtistObj in json){
      if(json[ArtistObj].Name.toLowerCase().includes(element.words.toLowerCase())){
        array.push(json[ArtistObj]);
      }
    }
    res.json(array)
  })
});

app.post('/delete', (req, res) => {
  var artist = req.body;
  var element =  JSON.parse(JSON.stringify(artist));
  fs.readFile(jsonFile, function (err, data) {
    var json = JSON.parse(data)
    json.splice(element, 1);
    for(var ArtistObj in json){
      console.log(ArtistObj+": "+json[ArtistObj].Name);
    }
    fs.writeFile(jsonFile, JSON.stringify(json, null, 4), function(err, result) {
      if(err) console.log('error', err);
    });
  })

});
