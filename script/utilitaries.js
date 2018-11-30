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
      restaurantList[checkRest].size += 1;
    }
    customerList.push(importCustomerList[custIndex]);
  });

  customerList = uniq(customerList);
}

function orderSelection(orderMin, orderMax) {
  var restaurantIds = [];
  var customerIds = [];
  restaurantList = restaurantList.filter(
    restaurant => restaurant.size >= orderMin && restaurant.size <= orderMax
  );

  console.log(JSON.stringify(restaurantList, 4, null));
  restaurantList.map(curr => {
    restaurantIds.push(curr.id);
  });
  deliveryList = deliveryList.filter(delivery =>
    restaurantIds.includes(delivery.restaurantId)
  );
  deliveryList.map(curr => {
    customerIds.push(curr.customerId);
  });

  customerList = customerList.filter(customer =>
    customerIds.includes(customer.id)
  );
  customerList = uniq(customerList);
}

function cleanRepresentation() {
  if (force != null) force.stop();

  force = null;
  drawedNode = [];

  nodes = [];
  dataLinks = [];
  links = null;

  svgContainer = d3.select("svg").remove();
}

function displayInformations(object) {
  d3.select("#text").remove();
  console.log(
    "ID:" +
      object.object.id +
      " LAT: " +
      object.object.lat +
      " LONG: " +
      object.object.long
  );
  if (object.object instanceof Restaurant) {
    d3.json(
      "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
        object.object.lat +
        "," +
        object.object.long +
        "&key=AIzaSyB9Tdu8PtVPicW1aNqi24jDsKxboS9DOQE",
      function(data) {
        var text = svgContainer
          .append("text")
          .text(function() {
            return [
              "Restaurant id: " +
                object.object.id +
                " address: " +
                data.results[0].formatted_address
            ];
          })
          .attr("font-family", "Arial")
          .attr("font-weight", "bold")
          .attr("font-size", "16px")
          .attr({
            id: "text",
            x: function() {
              return object.x - 30;
            },
            y: function() {
              return object.y - 15;
            }
          })
          .attr("fill", "black")
          .attr("stroke", "black")
          .attr("stroke-width", ".2px");

        var bbox = text.node().getBBox();
        rectangleLabel
          .attr("x", bbox.x - 6)
          .attr("y", bbox.y)
          .attr("rx", 10)
          .attr("ry", 10)
          .attr("width", bbox.width + 12)
          .attr("height", bbox.height)
          .attr("fill", "pink");
      }
    );
  } else {
    d3.json(
      "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
        object.object.lat +
        "," +
        object.object.long +
        "&key=AIzaSyB9Tdu8PtVPicW1aNqi24jDsKxboS9DOQE",
      function(data) {
        var text = svgContainer
          .append("text")
          .text(function() {
            return [
              "Client id: " +
                object.object.id +
                " address: " +
                data.results[0].formatted_address
            ];
          })
          .attr("font-family", "Arial")
          .attr("font-weight", "bold")
          .attr("font-size", "16px")
          .attr({
            id: "text",
            x: function() {
              return object.x - 30;
            },
            y: function() {
              return object.y - 15;
            }
          })
          .attr("fill", "black")
          .attr("stroke", "black")
          .attr("stroke-width", ".2px");

        var bbox = text.node().getBBox();
        rectangleLabel
          .attr("x", bbox.x - 6)
          .attr("y", bbox.y)
          .attr("rx", 10)
          .attr("ry", 10)
          .attr("width", bbox.width + 12)
          .attr("height", bbox.height)
          .attr("fill", "pink");
      }
    );
  }
  d3.event.stopPropagation();
}

function uniq(a) {
  return Array.from(new Set(a));
}
