var http = require('http');
var express = require('express');
var fs = require('fs');
//var DOMParser = global.DOMParser = require('xmldom').DOMParser;
//var WMSCapabilities = require('wms-capabilities');
var util = require('./util');

// create express app
var app = express();

//enable cross domain request by adding an option request
var allowCrossDomain = function(req, res, next) {
    if ('OPTIONS' == req.method) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
        res.send(200);
    } else {
        next();
    }
};

app.use(allowCrossDomain);
app.use(express.static('public'));

app.get('/', function(req, res) {
    res.send('Default page is working');
});

app.get('/wms-get-capability', function(req, res) {
    console.log("in wms-get-capability");

    //The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
    var options = {
        host: 'eumetview.eumetsat.int',
        path: '/geoserver/wms?service=wms&version=1.3.0&request=GetCapabilities'
    };

    callback = function(response) {
        var str = '';

        //another chunk of data has been recieved, so append it to `str`
        response.on('data', function(chunk) {
            str += chunk;
        });

        //the whole response has been recieved, so we just print it out here
        response.on('end', function() {

            var xml2js = require('xml2js');
            var parser = xml2js.Parser({'explicitArray' : false});
            parser.parseString(str, function(err, result) {
                if (err) throw err;

                result = util.cleanXML(result);

                console.log(result);
                res.send(JSON.stringify(result));
            });
        });
    }

    http.request(options, callback).end();

});

app.get('/bundle.js', function(req, res) {
    var data = fs.readFileSync('./bundle.js', 'utf8');
    res.send(data);
});

app.get('/NonTileLayer.js', function(req, res) {
    var data = fs.readFileSync('./NonTileLayer.js', 'utf8');
    res.send(data);
});

app.get('/NonTileLayer.WMS.js', function(req, res) {
    var data = fs.readFileSync('./NonTileLayer.WMS.js', 'utf8');
    res.send(data);
});

app.get('/map', function(req, res) {
    console.log("in map");

    var filePath = "./index.html";

    var data = fs.readFileSync('./index.html', 'utf8');

    /*fs.readFile(filePath, function (err, data) {
      if (err) {
         throw err;
      }
      console.log(data);
      res.send(data);
  });*/

    console.log(data);
    res.send(data);

});

// the rest
app.get('*', function(req, res) {
    console.log("error " +req );
    res.send('Error bad request');

});

var server = app.listen(3000, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);
});
