#!/bin/bash

#echo "browserify eumetview-leaflet.js ./public/bundle-leaflet.js" 
browserify eumetview-leaflet.js -o ./public/bundle-leaflet.js

#echo "browserify eumetview-openlayers.js ./public/bundle-openlayers.js" 
browserify eumetview-openlayers.js -o ./public/bundle-openlayers.js 

echo "browserify eumetview-d3.js ./public/bundle-d3.js" 
browserify eumetview-d3.js -o ./public/bundle-d3.js 
