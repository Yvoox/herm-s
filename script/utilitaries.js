// This function return the distance between 2 points given their longitude and latitude points
function distance(lng1, lat1, lng2, lat2) {
  let dl = lng2 - lng1;
  let dist = Math.acos(
    Math.sin(lat1) * Math.sin(lat2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.cos(dl)
  );
  // return distance in meters
  return dist * EARTH_RADIUS;
}

// Create a circle with a given radius and color
function create_circle(radius, color) {}

function normalize(val, max, min) {
  return (val - min) / (max - min);
}

function init() {
  csvImportD3(dataPath, function(ending) {
    if (ending) {
      svg = d3
        .select("body")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
      createNodes(restaurantList);

      createNodes(customerList);
    }
  });
}
//TODO BEFORE DRAWING
function arrayNormalize(array) {
  if (array.size != "undefined") {
    //restaurant
    var maxLong,
      maxLat,
      maxSize = 0;

    var minLong,
      minLat,
      minSize = 1000;
  }
  if (array.dist != "undefined") {
    //delivery
  } else {
    //customer
    var maxLong,
      maxLat,
      maxSize = 0;

    var minLong,
      minLat,
      minSize = 1000;
  }
}
