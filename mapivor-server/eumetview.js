// http://eumetview.eumetsat.int/geoserv/wms?service=WMS&version=1.3.0&request=GetCapabilities
//  time: '2015-11-13T09%3A00%3A00.000Z'
//  layers: 'meteosat:natural, 'bkg-raster:bkg-raster'],

// read info from getCapabilities
//var getCapabilitiesUrl = 'http://eumetview.eumetsat.int/geoserver/wms?service=wms&version=1.3.0&request=GetCapabilities';
var isDefined = function isDefined(x) {
    var undefined;
    return x !== undefined;
};

var getCapabilitiesUrl = 'http://localhost:3000/wms-get-capability';

//default obj containing the information
var info = { 'default' : 'meteosat:airmass', 'pos' : 0, selected : 'meteosat:airmass' };

// object containing the layers
var layers = {};

$(document).ready(function() {
    $( "#play" ).button({
      text: false,
      icons: {
        primary: "ui-icon-play"
      }
    })
    .click(function() {
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
		        	// update label
			        $('#time-label').text(info[info.selected].steps[info.pos]);

			        // update layer
			        var newStep = info[info.selected].steps[info.pos];
			        $('#time-label').text( newStep);
			        layers[info.selected].setParams( { time : newStep });
		        }

	    	} else {
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
	        	// update label
		        $('#time-label').text(info[info.selected].steps[info.pos]);

		        // update layer
		        var newStep = info[info.selected].steps[info.pos];
		        $('#time-label').text( newStep);
		        layers[info.selected].setParams( { time : newStep });
	        }

    	} else {
          // throw err
    	}    	
    });

    $( "#time" ).button({
    	disabled : true,
    });
  });

var getXMLRequest = $.ajax({
    url: getCapabilitiesUrl,
    contentType: "text/xml"
});

getXMLRequest.done(function(jsonStr) {
    //console.log(jsonStr);
    if (typeof jsonStr == "string") {
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

        draw_map(info);

         //set the first default steps in the time-label
    	$('#time-label').text(info['meteosat:airmass'].latest);

    } else {
        //xml = data;
        console.log("need to handle that error");
    }
});

getXMLRequest.fail(function(jqXHR, textStatus) {
    //console.log( "Ajax request failed... (" + textStatus + ' - ' + jqXHR.responseText ")." );
    console.log("Ajax request failed... (" + textStatus + ").");
});

function draw_map(info) {

    var crs = L.CRS.EPSG4326;
    var imageFormat = 'image/png8';
    var transparency = 'true';

    // backgound layer
    var bkgLayer = L.tileLayer.wms("http://eumetview.eumetsat.int/geoserv/wms", {
        layers: 'bkg-raster:bkg-raster',
        format: imageFormat,
        transparent: true,
        version: '1.3.0',
        crs: crs,
        attribution: "EUMETSAT 2015"
    });

    // country layer
    var countryBorders = L.tileLayer.wms("http://eumetview.eumetsat.int/geoserv/wms", {
        layers: 'overlay:vector-overlay',
        format: imageFormat,
        transparent: true,
        version: '1.3.0',
        crs: crs,
        attribution: "EUMETSAT 2015"
    });

    // load a tile layer
    var naturalLayer = L.tileLayer.wms("http://eumetview.eumetsat.int/geoserv/wms", {
        layers: 'meteosat:natural',
        format: imageFormat,
        transparent: true,
        version: '1.3.0',
        crs: crs,
        time: info['meteosat:natural'].latest,
        attribution: "EUMETSAT 2015"
    });

    layers['meteosat:airmass'] = L.tileLayer.wms("http://eumetview.eumetsat.int/geoserv/wms", {
        layers: 'meteosat:airmass',
        format: imageFormat,
        transparent: true,
        version: '1.3.0',
        crs: crs,
        time: info['meteosat:airmass'].latest,
        attribution: "EUMETSAT 2015"
    });

    // add truck attributes. Default - insert at overlayPane
    layers['nontiled'] = new L.NonTiledLayer.WMS("http://eumetview.eumetsat.int/geoserv/wms", {
        maxZoom: 8,
        minZoom: 0,
        layers: 'meteosat:airmass',
        format: imageFormat,
        transparent: true,
        version: '1.3.0',
        crs: crs,
        time: info['meteosat:airmass'].latest,
        attribution: "EUMETSAT 2015"
    });

    var dustLayer = L.tileLayer.wms("http://eumetview.eumetsat.int/geoserv/wms", {
        layers: 'meteosat:dust',
        format: imageFormat,
        transparent: true,
        version: '1.3.0',
        crs: crs,
        time: info['meteosat:dust'].latest,
        attribution: "EUMETSAT 2015"
    });

    // initialize the map
    var map = L.map('map', {
        center: [0, 0],
        zoom: 2,
    });

    // map control
    var baseMaps = {
        "Meteosat Natural Color": naturalLayer,
        "Meteosat Airmass": layers['meteosat:airmass'],
        "Meteosat Dust": dustLayer,
        "Non Tiled" : layers['nontiled']
    };

    var overlayMaps = {
        "Basemap": bkgLayer,
        "Country Borders": countryBorders
    };

    var ctrl = L.control.layers(baseMaps, {});
    var ctrl1 = L.control.layers({}, overlayMaps);

    map.addControl(ctrl);
    map.addControl(ctrl1);

    map.addLayer(layers['meteosat:airmass']);
    map.addLayer(countryBorders);
    map.addLayer(bkgLayer);

    map.on('baselayerchange', function(e) {
        console.log("change layer.");
    });
    /*if ($('#time-label').length) {
     
        console.log("Found");
        $('#time-label').text("hello");

    } */

}