// http://eumetview.eumetsat.int/geoserv/wms?service=WMS&version=1.3.0&request=GetCapabilities
//  time: '2015-11-13T09%3A00%3A00.000Z'

var getCapabilitiesUrl = 'http://localhost:3000/wms-get-capability';
//var getCapabilitiesUrl = 'http://eumetview.eumetsat.int/geoserv/wms?service=wms&version=1.3.0&request=GetCapabilities';

//  layers: 'meteosat:natural, 'bkg-raster:bkg-raster'],
var info = { 'default' : 'meteosat:airmass', 'pos' : 0, selected : 'meteosat:airmass' , animate: undefined};

// object containing the layers
var layers = {};

// util functions to be moved
var isDefined = function isDefined(x) {
    var undefined;
    return x !== undefined;
};

// end of util functions

/*
  Document ready. Install buttons outside the map for the time navigation
 */
$(document).ready(function() {

    setNavigationButtons(); // install jquery-ui navigation buttons

    // get capabilities and then draw the map
    fetch(getCapabilitiesUrl).then(function(response) {
        return response.text();
    }).then(function(jsonStr) {
        //console.log(jsonStr);
        if (typeof jsonStr == "string") {
            parseGetCapabilities(jsonStr);

             //set the first default steps in the time-label
            $('#time-label').text(info[info.default].latest);

            // update pos in info to match latest
            info.pos = info[info.default].lastSteps;

            //draw the map with layers
            drawMap(info);

        } else {
            throw new Error('Error: The returned response is not a string' + jsonStr);
        } 
    })
    .catch(function() {
      throw new Error('Cannot request getCapabilities from' + getCapabilitiesUrl);
    });
    ;
});

/*
Parse the getCapabilities results
 */
function parseGetCapabilities(jsonStr) {
  // json string to json object
  var jsonObj = $.parseJSON(jsonStr);

  //use jsonPath to access the object
  var jsonPath = require('JSONPath');
  var result = jsonPath.eval(jsonObj, "$..Layer.Layer");

  $.each(result[0], function(index, val) {

      var name = val.Name;
      var keys = Object.keys(val);
      var dim = val.Dimension;
      var time = "";
      if (isDefined(val.Dimension)) {
          time = val.Dimension["_"].split(",");
      }
      //console.log("Name: " + val.Name + " latest time:" + time[time.length - 1]);
      info[val.Name] = {
          "latest"     : time[time.length - 1],
          "steps"      : time,
          "lastSteps"  : time.length - 1
      };
  });
}

/*
 Install navigation buttons
 */
function setNavigationButtons() {
    $( "#play" ).button({
          text: false,
          icons: {
            primary: "ui-icon-play"
          }
        })
        .click(function() {
          
          // change button
          var options;
          if ( $( this ).text() === "play" ) {
            options = {
              label: "pause",
              icons: {
                primary: "ui-icon-pause"
              }
            };
          } else {
            options = {
              label: "play",
              icons: {
                primary: "ui-icon-play"
              }
            };
          }
          $( this ).button( "option", options );

          // action
          if ( $( this ).text() === "pause" ) {
             console.log("will start animation");
             startAnimation(info);  
          }
          else
          {
             console.log("will stop animation");
             stopAnimation(info);
          }
        });
        $( "#stop" ).button({
          text: false,
          icons: {
            primary: "ui-icon-stop"
          }
        })
        .click(function() {
          $( "#play" ).button( "option", {
            label: "play",
            icons: {
              primary: "ui-icon-play"
            }
          });

          console.log("will stop animation");
          stopAnimation(info);
        });
        $( "#prev" ).button({
              text: false,
              icons: {
                primary: "ui-icon-seek-start"
              }
            })
            .click(function() {
                console.log("prev");
                if ($('#time-label').length) {
                
                    // only change layer if we are not at step 0
                    if (info.pos > 0) {
                        info.pos -= 1;
                    }
                    else {
                        info.pos = info[info.selected].lastSteps;
                    }
                    // update label
                    $('#time-label').text(info[info.selected].steps[info.pos]);

                    // update layer
                    var newStep = info[info.selected].steps[info.pos];
                    $('#time-label').text( newStep);
                    layers[info.selected].setParams( { time : newStep });
                } 
                else {
                  // throw err
                }
            });
        $( "#next" ).button({
          text: false,
          icons: {
            primary: "ui-icon-seek-end"
          }
        })
        .click(function() {

           if ($('#time-label').length) {
                // only change layer if we are not at step 0
                if (info.pos < info[info.selected].lastSteps) {
                    info.pos += 1;
                }
                else  { // reach the end cycle to the beginning of the available time step
                    info.pos = 0;
                }
                
                // update label
                $('#time-label').text(info[info.selected].steps[info.pos]);

                // update layer
                var newStep = info[info.selected].steps[info.pos];
                $('#time-label').text( newStep);
                layers[info.selected].setParams( { time : newStep });              
            } 
            else {
              // throw err
            }       
        });

        $( "#time" ).button({
            disabled : true,
        });
};


/*
  draw the map 
 */
function drawMap(info) {

     var imageFormat = 'image/png';
     
     //proj4.defs("EPSG:3995","+proj=stere +lat_0=90 +lat_ts=71 +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs");  

     // proj mercator
     var crs  = 'EPSG:4326';
     var proj = ol.proj.get('EPSG:4326');
     var mapCentre = [0,0];

     //var crs  = 'EPSG:3995';
     //var proj = ol.proj.get('EPSG:3995');
     //var mapCentre = ol.proj.fromLonLat([45, 0], proj);



    // backgound layer
    var bkgLayer = new ol.layer.Tile({
        source: new ol.source.TileWMS({
                url: 'http://eumetview.eumetsat.int/geoserv/wms',
                params: {
                    'LAYERS' : 'bkg-raster:bkg-raster', 
                    'TILED'  : true,
                    'TRANSPARENT' : true,
                    'FORMAT' : imageFormat,
                    'CRS'    : crs,
                    'VERSION': '1.3.0'
                },
                serverType: 'geoserver'
        })
    })

    var countryBorderLayer = new ol.layer.Tile({
        source: new ol.source.TileWMS({
                url: 'http://eumetview.eumetsat.int/geoserv/wms',
                params: {
                    'LAYERS' : 'overlay:vector-overlay', 
                    'TILED'  : true,
                    'TRANSPARENT' : true,
                    'FORMAT' : imageFormat,
                    'CRS'    : crs,
                    'VERSION': '1.3.0'
                },
                serverType: 'geoserver'
        })
    })

    var naturalColorMSGLayer = new ol.layer.Tile({
        source: new ol.source.TileWMS({
                url: 'http://eumetview.eumetsat.int/geoserv/wms',
                params: {
                    'LAYERS' : 'meteosat:natural', 
                    'TILED'  : true,
                    'TRANSPARENT' : true,
                    'FORMAT' : imageFormat,
                    'CRS'    : crs,
                    'TIME'   : info['meteosat:natural'].latest,
                    'VERSION': '1.3.0'
                },
                serverType: 'geoserver'
        })
    })

    var ntNaturalColorMSGLayer = new ol.layer.Image({
        //extent: [-13884991, 2870341, -7455066, 6338219],
        source: new ol.source.ImageWMS({
        url: 'http://eumetview.eumetsat.int/geoserv/wms',
        params: {
            'LAYERS' : 'meteosat:natural', 
            'TILED'  : true,
            'TRANSPARENT' : true,
            'FORMAT' : imageFormat,
            'CRS'    : crs,
            'TIME'   : info['meteosat:natural'].latest,
            'VERSION': '1.3.0'
        },
        serverType: 'geoserver'
        })
    });

    var layers = [
        bkgLayer,
        naturalColorMSGLayer,
        //ntNaturalColorMSGLayer,
        countryBorderLayer,

      ];
      var map = new ol.Map({
        layers: layers,
        target: 'map',
        view: new ol.View({
          projection: proj,
          center: mapCentre,
          zoom: 2
        })
      });

}
