var http = require('http');
var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/wms-get-capability', function (req, res) {
  console.log("in callback");

  //The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
  var options = {
     host: 'eumetview.eumetsat.int',
     path: '/geoserver/wms?service=wms&version=1.3.0&request=GetCapabilities'
  };

  callback = function(response) {
    var str = '';

    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk;
    });

    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {
      console.log(str);
      //send back result via http
      res.send(str);
    });
  }

  http.request(options, callback).end();

});

// the rest
app.get('*', function (req, res) {
  res.send('Error Hello World!');
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});
