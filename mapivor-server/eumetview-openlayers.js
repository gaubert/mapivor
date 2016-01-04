// http://eumetview.eumetsat.int/geoserv/wms?service=WMS&version=1.3.0&request=GetCapabilities
//  time: '2015-11-13T09%3A00%3A00.000Z'
//  layers: 'meteosat:natural, 'bkg-raster:bkg-raster'],
var info = { 'default' : 'meteosat:airmass', 'pos' : 0, selected : 'meteosat:airmass' , animate: undefined};

// object containing the layers
var layers = {};


/*
  Document ready. Install buttons outside the map for the time navigation
 */
$(document).ready(function() {
    
	//draw the map with layers
	drawMap(info);
});


/*
  draw the map 
 */
function drawMap(info) {

     var imageFormat = 'image/png';
     var crs = 'EPSG:4326';

     var proj = ol.proj.get('EPSG:4326');

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
                    'VERSION': '1.3.0'
                },
                serverType: 'geoserver'
        })
    })

    var layers = [
        bkgLayer,
        naturalColorMSGLayer,
        countryBorderLayer,

      ];
      var map = new ol.Map({
        layers: layers,
        target: 'map',
        view: new ol.View({
          projection: proj,
          center: [0, 0],
          zoom: 1
        })
      });

}
