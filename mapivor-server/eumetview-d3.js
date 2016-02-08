

// util functions to be moved
var isDefined = function isDefined(x) {
    var undefined;
    return x !== undefined;
};

var width = 960,
    height = 500;

var orthographic = d3.geo.orthographic()
    .scale(250)
    .translate([width / 2, height / 2])
    .clipAngle(90);

var path = d3.geo.path()
    .projection(orthographic);

var lambda = d3.scale.linear()
    .domain([0, width])
    .range([-180, 180]);

var  omega = d3.scale.linear()
    .domain([0, height])
    .range([90, -90]);

// Create and configure the Equirectancular projection
var equirectangular = d3.geo.equirectangular()
        .scale(width / (2 * Math.PI))
        .translate([width / 2, height / 2]);

// Append the canvas element to the container div
var div = d3.select('#canvas-image');
var canvas = div.append('canvas')
        .attr('width', width)
        .attr('height', height);

var context = canvas.node().getContext('2d');

// Create the image element
var image = new Image;
image.src = 'http://localhost:3000/static/world.5400x2700.jpg';

image.onload = function() {
    console.log("Begin image.onload()");

    context.drawImage(image, 0, 0, image.width, image.height, 0, 0, width, height);
    
    // Reads the source image data from the canvas context
    var sourceData = context.getImageData(0, 0, image.width, image.height).data;

    // Creates an empty target image and gets its data
    var target = context.createImageData(image.width, image.height),
    
    targetData = target.data;

    // Iterate in the target image
    for (var x = 0, w = image.width; x < w; x += 1) {
        for (var y = 0, h = image.height; y < h; y += 1) {

            // Compute the geographic coordinates of the current pixel
            var coords = orthographic.invert([x, y]);

            // Source and target image indices
            var targetIndex, sourceIndex, pixels;

            // Check if the inverse projection is defined
            if ((!isNaN(coords[0])) && (!isNaN(coords[1]))) {

                  // Compute the source pixel coordinates
                  pixels = equirectangular(coords);

                  // Compute the index of the red channel
                  sourceIndex = 4 * (Math.floor(pixels[0]) + w * Math.floor(pixels[1]));
                  sourceIndex = sourceIndex - (sourceIndex % 4);

                  targetIndex = 4 * (x + w * y);
                  targetIndex = targetIndex - (targetIndex % 4);

                  // Copy the red, green, blue and alpha channels
                  targetData[targetIndex]     = sourceData[sourceIndex];
                  targetData[targetIndex + 1] = sourceData[sourceIndex + 1];
                  targetData[targetIndex + 2] = sourceData[sourceIndex + 2];
                  targetData[targetIndex + 3] = sourceData[sourceIndex + 3];
            }
        };
    };

    
    // Clear the canvas element and copy the target image
    context.clearRect(0, 0, image.width, image.height);
    context.putImageData(target, 0, 0);


    console.log("End image.onload()");
};

 // Add an event listener for the mousemove event
canvas.on('mousemove', function(d) {

        // Retrieve the mouse position relative to the canvas
        var pos = d3.mouse(this);

        // Compute the coordinates of the current position
        //var coords = equirectangular.invert(pos);

        // Create a label string, showing the coordinates
        //var label = [Math.round(coords[0] * 100) / 100, Math.round(coords[1] * 100) / 100].join(', ');

        // Cleans a small rectangle and append the label
        //context.clearRect(2, 2, 90, 14);
        //context.fillText(label, 4, 12);
});


$(document).ready(function () {

  console.log("Begin doc.ready()");
  console.log("End doc.ready()");

});
