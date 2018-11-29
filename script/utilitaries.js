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
  initCreation(function(callback) {
    if (callback) drawInContainer();
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

function searchId(id) {
  //console.log("NODES : " + JSON.stringify(nodes, 4, null));
  return nodes.findIndex(x => x.data == id);
}

function timeSelection(hourStart, hourEnd) {
  restaurantList = [];
  customerList = [];
  deliveryList = [];

  importDeliveryList.forEach(function(x) {
    var deliveryTime = x.t.substring(0, 2);
    if (deliveryTime > hourStart && deliveryTime < hourEnd) {
      deliveryList.push(x);
    }
  });

  deliveryList.map(x => {
    var restIndex = importRestaurantList.findIndex(
      rest => rest.id == x.restaurantId
    );
    var checkRest = restaurantList.findIndex(rest => rest.id == x.restaurantId);
    var custIndex = importCustomerList.findIndex(
      cust => cust.id == x.customerId
    );
    if (checkRest == -1) {
      restaurantList.push(importRestaurantList[restIndex]);
      restaurantList[restaurantList.length - 1].size = 0;
    } else {
      restaurantList[checkRest].size = restaurantList[checkRest].size + 1;
    }
    customerList.push(importCustomerList[custIndex]);
  });

  customerList = uniq(customerList);
}

function orderSelection(orderNumber) {}

function cleanRepresentation() {
  if (force != null) force.stop();

  force = null;
  drawedNode = [];

  nodes = [];
  dataLinks = [];
  links = null;

  svgContainer = d3.select("svg").remove();
}

function uniq(a) {
  return Array.from(new Set(a));
}
