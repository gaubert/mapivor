// http://eumetview.eumetsat.int/geoserv/wms?service=WMS&version=1.3.0&request=GetCapabilities
//  time: '2015-11-13T09%3A00%3A00.000Z'

var getCapabilitiesUrl = 'http://localhost:3000/wms-get-capability';
//var getCapabilitiesUrl = 'http://eumetview.eumetsat.int/geoserv/wms?service=wms&version=1.3.0&request=GetCapabilities';

//  layers: 'meteosat:natural, 'bkg-raster:bkg-raster'],
var info = { 'default' : 'meteosat:natural', 'pos' : 0, selected : 'nt:meteosat:natural' , animate: undefined};

// object containing the layers
var layersMap = {};

//default obj containing the information
var animationSpeed     = 300 // ms. waiting time between each image
var animationImgLoaded = true; // start at true

// util functions to be moved
var isDefined = function isDefined(x) {
    var undefined;
    return x !== undefined;
};

// end of util functions
/*
 window resized
 redraw
 */
$(window).resize(function () {

  console.log("RESIZE");

  //get the window height and width
  var h = $(window).height();
  var w = $(window).width();

  /* get size from the canvas */
  var canvasheight=$('#map').parent().parent().height();
  var canvaswidth =$('#map').parent().parent().width();

  console.log("h=" +h + ",w="+w+"canvasheight="+canvasheight+"canvaswidth="+canvaswidth);

  if (canvaswidth > w)
  {
    canvaswidth = w;
  }

  if (canvasheight > h)
  {
    canvasheight = h;
  }

  /* update map size */
  $('#map').css("height", canvasheight.toString() + "px");
  $('#map').css("width",  canvaswidth.toString() + "px");

  // get map which wa stored in a DOM data
  var map = $('#map').data('map');

  // in case we would like to centre on the previously map centre
  // this will move the map out of the view port
  //var centreCoords = map.getView().getCenter();

  // update to new size
  map.updateSize();

  // recenter the map on the previous centre
  var size = map.getSize();

  var viewpos = [size[0]/2, size[1]/2];

  var view = map.getView();
  view.centerOn(
      [0,0],  // this depends on the projection (if north polar then [-90,0])
      size,
      viewpos
  );

  map.render();

  size = map.getSize();

  console.log("new size =" + size);
      
  /*var canvasheight=$('#map').parent().parent().css('height');
  var canvaswidth=$('#map').parent().parent().css('width');

  $('#map').css("height", canvasheight);
  $('#map').css("width", canvaswidth);

  var map = $('#map').data('map');

  var centreCoords = map.getView().getCenter();

  map.updateSize();

  centreCoords = map.getView().getCenter();

  map.getView().setCenter([0,0]);

  map.render();

  centreCoords = map.getView().getCenter();


  console.log("RESIZED to canvasheight:" + canvasheight + " canvaswidth:" + canvaswidth);*/

});


/*
  Document ready. Install buttons outside the map for the time navigation
 */
$(document).ready(function() {

    setNavigationButtons(); // install jquery-ui navigation buttons

    //setLayerSwitcher(); // install tempo layer switcher panel

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
    }).catch(function(msg) {
      throw new Error('Cannot request getCapabilities from' + getCapabilitiesUrl);
    });
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

      // add temporarely nt: version of all layers
      var dummyStr = 'nt:'+val.Name;
      info[dummyStr] = info[val.Name];
  });
}

/* 
Install layer switcher
*/
function switchLayer()
{ 
  var checkedLayer = $('#layerswitcher input[name=layer]:checked').val();
  console.log(layers.toString());
  for (i = 0, ii = layers.length; i < ii; ++i) {
    layers[i].setVisible(i==checkedLayer);
  }
}

function setLayerSwitcher()
{
  $(function() { switchLayer() } );
  $("#layerswitcher input[name=layer]").change(function() { switchLayer() } );
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
                    layersMap[info.selected].getSource().updateParams( { 'TIME' : newStep });
                    layersMap[info.selected].getSource().changed();
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
                layersMap[info.selected].getSource().updateParams( { 'TIME' : newStep });
                layersMap[info.selected].getSource().changed();

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
  manage the animation when the play button is clicked.
 */ 
function startAnimation(info) {

   console.log("station animation");
   if (! isDefined(info.animate)) {

      info.animate = setInterval(function(){
        
            if (animationImgLoaded)
            {
              animationImgLoaded = false;
              console.log("Next interval");

            if (info.pos < info[info.selected].lastSteps) {
                console.log("animate step " + info.pos);
                info.pos += 1;
                
                // update layer and label
                var newStep = info[info.selected].steps[info.pos];

                $('#time-label').text( newStep);
                layersMap[info.selected].getSource().updateParams( { 'TIME' : newStep });
                layersMap[info.selected].getSource().changed();
            }
            else
            {
                //reset to pos 0
                info.pos = 0;
            }
          }
          console.log("do nothing, wait for the image to be loaded");
      }, animationSpeed);    
   }
}

/*
   Stop the animation mode
 */
function stopAnimation(info) {
  console.log("stop animation");
  clearInterval(info.animate);
  info.animate = undefined;
}


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
        title: 'Natural Earth',
                type: 'base',
                visible: true,
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

    layersMap['bkg-raster:bkg-raster'] = bkgLayer;

    // add all basemaps in a group
    var baseMapGroup = new ol.layer.Group({
        'title': 'Base maps',
        layers : [ bkgLayer ]        
    });

    var countryBorderLayer = new ol.layer.Tile({
        title: 'Country Borders',
        visible: true,
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

    layersMap['overlay:vector-overlay'] = countryBorderLayer;

    var naturalColorMSGLayer = new ol.layer.Tile({
        title: 'Meteosat 2nd Gen Natural Color',
        visible: false,
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

    // add tile loading events
    //asign the listeners on the source of tile layer
    naturalColorMSGLayer.getSource().on('tileloadstart', function(event) {
      //replace with your custom action
      console.log("starting to load tiles");
     });

    naturalColorMSGLayer.getSource().on('tileloadend', function(event) {
      console.log("finished to load tiles");
     });

    naturalColorMSGLayer.getSource().on('tileloaderror', function(event) {
      console.log("error while loading tiles");
     });

    layersMap['meteosat:natural'] = naturalColorMSGLayer;

    var ntNaturalColorMSGLayer = new ol.layer.Image({
        //extent: [-13884991, 2870341, -7455066, 6338219],       
        title: 'Meteosat 2nd Gen Natural Color FI',
        visible: true,
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

    // add image loading events
    //and now asign the listeners on the source of it
    var ImgSource = ntNaturalColorMSGLayer.getSource();
    ImgSource.on('imageloadstart', function(event) {
        console.log('imageloadstart event',event);
        animationImgLoaded = false;
    });

    ImgSource.on('imageloadend', function(event) {
     console.log('imageloadend event',event);
     animationImgLoaded = true;
    });

    ImgSource.on('imageloaderror', function(event) {
     console.log('imageloaderror event',event);
    }); 


    layersMap['nt:meteosat:natural'] = ntNaturalColorMSGLayer;

    var overlaysGroup = new ol.layer.Group({
        'title': 'Overlays',
        layers : [   
                    ntNaturalColorMSGLayer,
                    naturalColorMSGLayer,
                    countryBorderLayer
                 ]        
    });

    var layers = [
        baseMapGroup,
        overlaysGroup
      ];

    var map = new ol.Map({
        interactions: ol.interaction.defaults({mouseWheelZoom:false}),
        layers: layers,
        target: 'map',
        view: new ol.View({
          projection: proj,
          center: mapCentre,
          zoom: 3,
          minZoom: 3,
          maxZoom: 7
        })
    });

    // add map as data in the DOM
    $('#map').data('map', map);

    var layerSwitcher = new ol.control.LayerSwitcher({
        tipLabel: 'Légende' // Optional label for button
    });

    map.addControl(layerSwitcher);

    console.log("Map size = " +map.getSize());

}
