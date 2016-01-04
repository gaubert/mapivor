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

    var layers = [
        new ol.layer.Tile({
          source: new ol.source.MapQuest({layer: 'sat'})
        }),
        new ol.layer.Tile({
          extent: [-13884991, 2870341, -7455066, 6338219],
          source: new ol.source.TileWMS({
            url: 'http://demo.boundlessgeo.com/geoserver/wms',
            params: {'LAYERS': 'topp:states', 'TILED': true},
            serverType: 'geoserver'
          })
        })
      ];
      var map = new ol.Map({
        layers: layers,
        target: 'map',
        view: new ol.View({
          center: [-10997148, 4569099],
          zoom: 4
        })
      });

}
