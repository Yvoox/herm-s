// This function return the distance between 2 points given their longitude and latitude points
function distance(lng1, lat1, lng2, lat2) {
  let dl = lng2 - lng1;
  let dist = Math.acos(Math.sin(lat1)*Math.sin(lat2) + Math.cos(lat1)*Math.cos(lat2)*Math.cos(dl));
  // return distance in meters
  return dist * EARTH_RADIUS;
}

// Create a circle with a given radius and color
function create_circle(radius, color) {
  
}
