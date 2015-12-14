// http://eumetview.eumetsat.int/geoserv/wms?service=WMS&version=1.3.0&request=GetCapabilities
//  time: '2015-11-13T09%3A00%3A00.000Z'
//  layers: 'meteosat:natural, 'bkg-raster:bkg-raster'],

// read info from getCapabilities
//var getCapabilitiesUrl = 'http://eumetview.eumetsat.int/geoserver/wms?service=wms&version=1.3.0&request=GetCapabilities';
var isDefined = function isDefined(x) {
    var undefined;
    return x !== undefined;
};

function censor(censor) {
  var i = 0;

  return function(key, value) {
    if(i !== 0 && typeof(censor) === 'object' && typeof(value) == 'object' && censor == value) 
      return '[Circular]'; 

    if(i >= 29) // seems to be a harded maximum of 30 serialized objects?
      return '[Unknown]';

    ++i; // so we know we aren't using the original object anymore

    return value;  
  }
}

var getCapabilitiesUrl = 'http://localhost:3000/wms-get-capability';

//default obj containing the information
var animationSpeed     = 300 // ms. waiting time between each image
var animationImgLoaded = true; // start at true

var info = { 'default' : 'meteosat:airmass', 'pos' : 0, selected : 'meteosat:airmass' , animate: undefined};

// object containing the layers
var layers = {};


/*
  Document ready. Install buttons outside the map for the time navigation
 */
$(document).ready(function() {
    
    setNavigationButtons(); // install jquery-ui navigation buttons

    // ajax reques to get the GetCapabilities results and then draw the map
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

	        //draw the map with layers
	        drawMap(info);

	         //set the first default steps in the time-label
	    	$('#time-label').text(info[info.default].latest);

	    	// update pos in info to match latest
	    	info.pos = info[info.default].lastSteps;

	    } else {
	        //xml = data;
	        console.log("need to handle that error");
	    }
	});

	getXMLRequest.fail(function(jqXHR, textStatus) {
	    //console.log( "Ajax request failed... (" + textStatus + ' - ' + jqXHR.responseText ")." );
	    console.log("Ajax request failed... (" + textStatus + ").");
	});
});

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
		            layers[info.selected].setParams( { time : newStep });
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

    //var leafletWMS = require('leaflet.wms');

    var crs = L.CRS.EPSG4326;
    //var imageFormat = 'image/png8';
    var imageFormat = 'image/png';
    var transparency = 'true';

    // test stereo proj CRS
    // Create new CRS for EPSG:3573.
    // Proj4 definition string can be found online.
    var CRS3395 = new L.Proj.CRS('EPSG3995',
      '+proj=stere +lat_0=90 +lat_ts=71 +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs', {
        origin: [0,75],
        resolutions: [131072, 65536, 32768, 16384, 8192, 4096, 2048]
    });

    //crs = CRS3395;

    // backgound layer
    var bkgLayer = L.tileLayer.wms("http://eumetview.eumetsat.int/geoserv/wms", {
        layers: 'bkg-raster:bkg-raster',
        format: imageFormat,
        transparent: true,
        version: '1.3.0',
        crs: crs,
        continuousWorld: true,
        zIndex: 0, //lowest zindex
        attribution: "EUMETSAT 2015"
    });

    

    // country layer
    var countryBorders = L.tileLayer.wms("http://eumetview.eumetsat.int/geoserv/wms", {
        layers: 'overlay:vector-overlay',
        format: imageFormat,
        transparent: true,
        version: '1.3.0',
        crs: crs,
        zIndex: 7,  // hihest z index
        attribution: "EUMETSAT 2015"
    });

    // load a tile layer
    layers['meteosat:natural'] = L.tileLayer.wms("http://eumetview.eumetsat.int/geoserv/wms", {
        layers: 'meteosat:natural',
        format: imageFormat,
        transparent: true,
        version: '1.3.0',
        crs: crs,
        zIndex: 1,
        time: info['meteosat:natural'].latest,
        attribution: "EUMETSAT 2015"
    });

    layers['meteosat:airmass'] = L.tileLayer.wms("http://eumetview.eumetsat.int/geoserv/wms", {
        layers: 'meteosat:airmass',
        format: imageFormat,
        transparent: true,
        version: '1.3.0',
        crs: crs,
        zIndex: 1,
        time: info['meteosat:airmass'].latest,
        attribution: "EUMETSAT 2015"
    });

    layers['meteosat:dust'] = L.tileLayer.wms("http://eumetview.eumetsat.int/geoserv/wms", {
        layers: 'meteosat:dust',
        format: imageFormat,
        transparent: true,
        version: '1.3.0',
        crs: crs,
        zIndex: 1,
        time: info['meteosat:dust'].latest,
        attribution: "EUMETSAT 2015"
    });

    // add NonTiled Layers
    layers['nt:meteosat:airmass'] = L.WMS.overlay("http://eumetview.eumetsat.int/geoserv/wms", {
        maxZoom: 8,
        minZoom: 0,
        layers: 'meteosat:airmass',
        format: imageFormat,
        transparent: true,
        version: '1.3.0',
        crs: crs,
        zIndex: 1,
        time: info['meteosat:airmass'].latest,
        attribution: "EUMETSAT 2015"
    });

    // update info to have the same steps as meteosat airmass for the moment
    info['nt:meteosat:airmass'] = info['meteosat:airmass'];

    layers['nt:meteosat:natural'] = L.WMS.overlay("http://eumetview.eumetsat.int/geoserv/wms", {
        maxZoom: 8,
        minZoom: 0,
        layers: 'meteosat:natural',
        format: imageFormat,
        transparent: true,
        version: '1.3.0',
        crs: crs,
        zIndex: 1,
        time: info['meteosat:natural'].latest,
        attribution: "EUMETSAT 2015"
    });

    // update info to have the same steps as meteosat airmass for the moment
    info['nt:meteosat:natural'] = info['meteosat:natural'];

    layers['nt:meteosat:dust'] = L.WMS.overlay("http://eumetview.eumetsat.int/geoserv/wms", {
        maxZoom: 8,
        minZoom: 0,
        layers: 'meteosat:dust',
        format: imageFormat,
        transparent: true,
        version: '1.3.0',
        crs: crs,
        zIndex: 1,
        time: info['meteosat:dust'].latest,
        attribution: "EUMETSAT 2015"
    });

    // update info to have the same steps as meteosat airmass for the moment
    info['nt:meteosat:dust'] = info['meteosat:dust'];

    // initialize the map
    var map = L.map('map', {
        //center: [0, 0],
        center: [0,75],
        zoom: 2,
        continuousWorld: true,
        crs: crs
    });

    // map control
    var baseMaps = {
        "Meteosat Natural Color"   : layers['meteosat:natural'],
        "Meteosat Airmass"         : layers['meteosat:airmass'],
        "Meteosat Dust"            : layers['meteosat:dust'],
        "NT Meteosat Airmass"      : layers['nt:meteosat:airmass'],
        "NT Meteosat Natural"      : layers['nt:meteosat:natural'],
        "NT Meteosat Dust"         : layers['nt:meteosat:dust'],
    }; 

    // correspondance Names shown on the map and layer names
    var baseMapsNames = {
        "Meteosat Natural Color" : 'meteosat:natural',
        "Meteosat Airmass"       : 'meteosat:airmass',
        "Meteosat Dust"          : 'meteosat:dust',
        "NT Meteosat Airmass"    : 'nt:meteosat:airmass',
        "NT Meteosat Natural"    : 'nt:meteosat:natural',
        "NT Meteosat Dust"       : 'nt:meteosat:dust',
    }

    var overlayMaps = {
        "Basemap": bkgLayer,
        "Country Borders": countryBorders
    };

    var ctrlBaseMaps    = L.control.layers(baseMaps, {});
    var ctrlOverlayMaps = L.control.layers({}, overlayMaps);
    var ctrlProj        = L.easyButton( '&lt;span class="star"&gt;&amp;starf;&lt;/span&gt;', function(){
                                 alert('you just clicked the html entity \&amp;starf;');
                          });

    map.addControl(ctrlBaseMaps);
    map.addControl(ctrlOverlayMaps);
    ctrlProj.addTo(map);
    
    //map.addLayer(layers['meteosat:airmass']);
    map.addLayer(countryBorders);
    map.addLayer(bkgLayer);

    
    // set closure
    layers['nt:meteosat:natural'].on('load', function(e) {
		console.log("loaded nt:meteosat:natural layer");
		animationImgLoaded = true;		
	});

	// set closure
    layers['nt:meteosat:airmass'].on('load', function(e) {
		console.log("loaded nt:meteosat:airmass layer");
		animationImgLoaded = true;		
	});

	layers['nt:meteosat:dust'].on('load', function(e) {
		console.log("loaded nt:meteosat:dust layer");
		animationImgLoaded = true;		
	});

    map.on('baselayerchange', function(e) {
        console.log("change layer: " + JSON.stringify(e, censor(e)));
        console.log("change to layer: " + e.name);
        
        info.selected = baseMapsNames[e.name];
        console.log("info.selected =" + info.selected);

        var bounds = map.getPixelBounds(),
            sw = map.unproject(bounds.getBottomLeft()),
            ne = map.unproject(bounds.getTopRight());
    });
}
