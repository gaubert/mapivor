var http = require('http');

console.log("Hello");

  //The url we want is: 'http://eumetview.eumetsat.int/geoserver/wms?service=wms&version=1.3.0&request=GetCapabilities'
  var options = {
     host: 'eumetview.eumetsat.int',
     path: '/geoserver/wms?service=wms&version=1.3.0&request=GetCapabilities'
  };

  callback = function(response) {
    var str = '';
    console.log("in callback");

    //another chunk of data has been recieved, so append it to `str`
    response.on('data', function (chunk) {
      str += chunk;
    });

    console.log("str=" + str);

    //the whole response has been recieved, so we just print it out here
    response.on('end', function () {
      console.log(str);
    });
  }

  http.request(options, callback).end();
  console.log("Bye");
