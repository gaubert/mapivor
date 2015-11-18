
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
  
  var getXMLRequest = $.ajax({
     url: getCapabilitiesUrl,
     contentType: "text/xml"
  });


  var jsonString = null;

  getXMLRequest.done(function(jsonStr)
  {
    //console.log(jsonStr);
    if (typeof jsonStr == "string")
    {
       // json string to json object
       var jsonObj = $.parseJSON(jsonStr);
      
       //use jsonPath to access the object
       var jsonPath = require('JSONPath');
       var result = jsonPath.eval(jsonObj, "$..Layer.Layer");

        var info = {};
        $.each(result[0], function(index, val) {

        	var name = val.Name;
        	var keys = Object.keys(val);
        	var dim  = val.Dimension;
        	var time = "";
        	if (isDefined(val.Dimension))
        	{
        		time = val.Dimension["_"].split(",");
        		//console.log("time" + time);
  			}
        	//console.log("Val -------" + name + "------" + JSON.stringify(time) + "----------" + JSON.stringify(val));
        	console.log("Name: " + val.Name + " latest time:" + time[time.length - 1]);
        	info[val.Name] = time[time.length - 1];
  		});

       draw_map(info);
    }
    else
    {
        //xml = data;
        console.log("need to handle that error");
    }
  });

  getXMLRequest.fail(function(jqXHR, textStatus)
  {
     //console.log( "Ajax request failed... (" + textStatus + ' - ' + jqXHR.responseText ")." );
     console.log("Ajax request failed... (" + textStatus + ").");
  });

  //var jsonString = new WMSCapabilities(xmlString).toJSON();
  //console.log(jsonString);

  function draw_map(info)
  {

	  var crs = L.CRS.EPSG4326;
	  var imageFormat  = 'image/png8';
	  var transparency = 'true';
	  var time = '2015-11-13T10:15:00.000Z';

	  console.log("info " + info);

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
		time: time,
		attribution: "EUMETSAT 2015"
	  });

	  // load a tile layer
	  var naturalLayer = L.tileLayer.wms("http://eumetview.eumetsat.int/geoserv/wms", {
		layers: 'meteosat:natural',
		format: imageFormat,
		transparent: true,
		version: '1.3.0',
		crs: crs,
		time: info['meteosat:natural'],
		attribution: "EUMETSAT 2015"
	  });

	  var airmassLayer = L.tileLayer.wms("http://eumetview.eumetsat.int/geoserv/wms", {
		layers: 'meteosat:airmass',
		format: imageFormat,
		transparent: true,
		version: '1.3.0',
		crs: crs,
		time: info['meteosat:airmass'],
		attribution: "EUMETSAT 2015"
	  });


	  var dustLayer = L.tileLayer.wms("http://eumetview.eumetsat.int/geoserv/wms", {
		layers: 'meteosat:dust',
		format: imageFormat,
		transparent: true,
		version: '1.3.0',
		crs: crs,
		time: info['meteosat:dust'],
		attribution: "EUMETSAT 2015"
	  });

	  // initialize the map
	  var map = L.map('map', {
		  center: [0,0],
		  zoom: 2,
		 });
	   
	   // map control
	   var baseMaps = {
		   "Meteosat Natural Color" : naturalLayer,
		   "Meteosat Airmass"       : airmassLayer,
		   "Meteosat Dust"          : dustLayer,
	   };
	  
	   var overlayMaps = {
		   "Basemap" : bkgLayer,
		   "Country Borders" : countryBorders
	   };
	 
	   var ctrl  = L.control.layers(baseMaps , {});
	   var ctrl1 = L.control.layers( {}, overlayMaps);

	   map.addControl(ctrl);
	   map.addControl(ctrl1);

	   map.addLayer(airmassLayer);
	   map.addLayer(countryBorders);
	   map.addLayer(bkgLayer);
  }
