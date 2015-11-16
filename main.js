
  // http://eumetview.eumetsat.int/geoserv/wms?service=WMS&version=1.3.0&request=GetCapabilities
  //  time: '2015-11-13T09%3A00%3A00.000Z'
  //  layers: 'meteosat:natural, 'bkg-raster:bkg-raster'],

  // read info from getCapabilities
  var WMSCapabilities = require('wms-capabilities');
  fs = require('fs');

  fs.readFile('getCapabilities.xml', 'utf8', function (err,xmlString) {
  if (err) {
    return console.log(err);
  }

  var jsonString = new WMSCapabilities(xmlString).toJSON();
  console.log(jsonString);

  });

  var crs = L.CRS.EPSG4326;
  var imageFormat  = 'image/png8';
  var transparency = 'true';
  var time = '2015-11-13T10:15:00.000Z';

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
    time: time,
    attribution: "EUMETSAT 2015"
  });

  var airmassLayer = L.tileLayer.wms("http://eumetview.eumetsat.int/geoserv/wms", {
    layers: 'meteosat:airmass',
    format: imageFormat,
    transparent: true,
    version: '1.3.0',
    crs: crs,
    time: time,
    attribution: "EUMETSAT 2015"
  });


  var dustLayer = L.tileLayer.wms("http://eumetview.eumetsat.int/geoserv/wms", {
    layers: 'meteosat:dust',
    format: imageFormat,
    transparent: true,
    version: '1.3.0',
    crs: crs,
    time: time,
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
