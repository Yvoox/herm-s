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
  if (!firstInit) {
    drawLegend();
    firstInit = true;
  }
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
  console.log("CUSTOMER LENGTH: " + customerList.length);
  console.log("RESTAURANT LENGTH: " + restaurantList.length);
  console.log("DELIVERY LENGTH: " + deliveryList.length);
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
  console.log("CUSTOMER LENGTH: " + customerList.length);
  console.log("RESTAURANT LENGTH: " + restaurantList.length);
  console.log("DELIVERY LENGTH: " + deliveryList.length);
}

function areaSelection(centerLat, centerLong, radius) {
  //radius in meters

  var restaurantIds = [];
  var customerIds = [];
  customerList = customerList.filter(
    customer =>
      getDistance(centerLat, centerLong, customer.lat, customer.long) <=
      radius / 1000
  );

  console.log(JSON.stringify(customerList, 4, null));
  customerList.map(curr => {
    customerIds.push(curr.id);
  });
  deliveryList = deliveryList.filter(delivery =>
    customerIds.includes(delivery.customerId)
  );
  deliveryList.map(curr => {
    restaurantIds.push(curr.restaurantId);
  });

  restaurantList = restaurantList.filter(restaurant =>
    restaurantIds.includes(restaurant.id)
  );
  customerList = uniq(customerList);
  console.log("CUSTOMER LENGTH: " + customerList.length);
  console.log("RESTAURANT LENGTH: " + restaurantList.length);
  console.log("DELIVERY LENGTH: " + deliveryList.length);
}

function customerSelection(orderMin, orderMax) {
  var restaurantIds = [];
  var customerIds = [];
  customerList = customerList.filter(
    customer =>
      customer.nbCommande >= orderMin && customer.nbCommande <= orderMax
  );

  console.log(JSON.stringify(customerList, 4, null));
  customerList.map(curr => {
    customerIds.push(curr.id);
  });
  deliveryList = deliveryList.filter(delivery =>
    customerIds.includes(delivery.customerId)
  );
  deliveryList.map(curr => {
    restaurantIds.push(curr.restaurantId);
  });

  restaurantList = restaurantList.filter(restaurant =>
    restaurantIds.includes(restaurant.id)
  );
  customerList = uniq(customerList);
  console.log("CUSTOMER LENGTH: " + customerList.length);
  console.log("RESTAURANT LENGTH: " + restaurantList.length);
  console.log("DELIVERY LENGTH: " + deliveryList.length);
}

function cleanRepresentation() {
  if (force != null) force.stop();

  force = null;
  drawedNode = [];

  nodes = [];
  dataLinks = [];
  links = null;

  //svgContainer = d3.select("svg").remove();
  svgContainer = svgContainer.remove();
}

function displayInformations(object) {
  const x_value_range = [
    d3.min(nodes.slice(2), d => d.x),
    d3.max(nodes.slice(2), d => d.x)
  ];
  const y_value_range = [
    d3.min(nodes.slice(2), d => d.y),
    d3.max(nodes.slice(2), d => d.y)
  ];

  const pointX_to_svgX = d3.scale
    .linear()
    .domain(x_value_range)
    .range([0, width]);

  const pointY_to_svgY = d3.scale
    .linear()
    .domain(y_value_range)
    .range([height, 0]);
  d3.selectAll("#text").remove();
  d3.select("#label").remove();
  rectangleLabel = svgContainer
    .append("rect")
    .attr("id", "label")
    .attr("opacity", 100);
  console.log(
    "ID:" +
      object.object.id +
      " LAT: " +
      object.object.lat +
      " LONG: " +
      object.object.long
  );
  if (!viewType) {
    var x = object.x;
    var y = object.y;
  } else {
    var x = pointX_to_svgX(object.x);
    var y = pointY_to_svgY(object.y);
  }
  if (object.object instanceof Restaurant) {
    d3.json(
      "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
        object.object.lat +
        "," +
        object.object.long +
        "&key=AIzaSyB9Tdu8PtVPicW1aNqi24jDsKxboS9DOQE",
      function(data) {
        var address = svgContainer
          .append("text")
          .text(function() {
            return [
              " Restaurant address: " + data.results[0].formatted_address
            ];
          })
          .attr("font-family", "Arial")
          .attr("font-weight", "bold")
          .attr("font-size", "16px")
          .attr({
            id: "text",
            x: function() {
              return x - 30;
            },
            y: function() {
              return y - 15;
            }
          })
          .attr("fill", "black")
          .attr("stroke", "black")
          .attr("stroke-width", ".2px");
        var addressBbox = address.node().getBBox();

        var order = svgContainer
          .append("text")
          .text(function() {
            return [" Number of orders: " + object.object.size];
          })
          .attr("font-family", "Arial")
          .attr("font-weight", "bold")
          .attr("font-size", "16px")
          .attr({
            id: "text",
            x: function() {
              return x - 30;
            },
            y: function() {
              return y - 15 - addressBbox.height;
            }
          })
          .attr("fill", "black")
          .attr("stroke", "black")
          .attr("stroke-width", ".2px");

        var orderBbox = order.node().getBBox();
        rectangleLabel
          .attr("x", orderBbox.x - 6)
          .attr("y", orderBbox.y)
          .attr("rx", 10)
          .attr("ry", 10)
          .attr(
            "width",
            addressBbox.width > orderBbox.width
              ? addressBbox.width + 12
              : orderBbox.width + 12
          )
          .attr("height", addressBbox.height + orderBbox.height)
          .attr("fill", "pink");
      }
    );
    /*d3.json(
      "https://maps.googleapis.com/maps/api/place/textsearch/jsonp?query=restaurants&location=" +
        object.object.lat +
        "," +
        object.object.long +
        "&radius=1&key=AIzaSyB9Tdu8PtVPicW1aNqi24jDsKxboS9DOQE",
      function(data) {
        console.log(data);
      }
    );*/
  } else {
    d3.json(
      "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
        object.object.lat +
        "," +
        object.object.long +
        "&key=AIzaSyB9Tdu8PtVPicW1aNqi24jDsKxboS9DOQE",
      function(data) {
        var address = svgContainer
          .append("text")
          .text(function() {
            return [" Customer address: " + data.results[0].formatted_address];
          })
          .attr("font-family", "Arial")
          .attr("font-weight", "bold")
          .attr("font-size", "16px")
          .attr({
            id: "text",
            x: function() {
              return x - 30;
            },
            y: function() {
              return y - 15;
            }
          })
          .attr("fill", "black")
          .attr("stroke", "black")
          .attr("stroke-width", ".2px");
        var addressBbox = address.node().getBBox();

        var order = svgContainer
          .append("text")
          .text(function() {
            return [" Number of orders: " + object.object.nbCommande];
          })
          .attr("font-family", "Arial")
          .attr("font-weight", "bold")
          .attr("font-size", "16px")
          .attr({
            id: "text",
            x: function() {
              return x - 30;
            },
            y: function() {
              return y - 15 - addressBbox.height;
            }
          })
          .attr("fill", "black")
          .attr("stroke", "black")
          .attr("stroke-width", ".2px");

        var orderBbox = order.node().getBBox();
        rectangleLabel
          .attr("x", orderBbox.x - 6)
          .attr("y", orderBbox.y)
          .attr("rx", 10)
          .attr("ry", 10)
          .attr(
            "width",
            addressBbox.width > orderBbox.width
              ? addressBbox.width + 12
              : orderBbox.width + 12
          )
          .attr("height", addressBbox.height + orderBbox.height)
          .attr("fill", "pink");
      }
    );
  }
  d3.event.stopPropagation();
}

function uniq(a) {
  return Array.from(new Set(a));
}

function initText() {
  svgContainer
    .append("text")
    .text(message)
    .attr("x", 10)
    .attr("y", 20);
}

function timeClick() {
  buttonClicked = true;
  svgContainer.selectAll("text").remove();
  clearAllTimers();
  t1 = setTimeout(() => {
    restartUI();
    timeSelection(5, 12);
    cleanRepresentation();
    init();
    svgContainer
      .append("text")
      .text(
        "Only 3% of orders are placed before noon compared to 97% in the afternoon."
      )
      .attr("x", 10)
      .attr("y", 20);
  }, 1000);
  t1 = setTimeout(() => {
    restartUI();
    timeSelection(12, 23);
    cleanRepresentation();
    init();
    svgContainer
      .append("text")
      .text(
        "Only 3% of orders are placed before noon compared to 97% in the afternoon."
      )
      .attr("x", 10)
      .attr("y", 20);
  }, 7000);
  t2 = setTimeout(() => {
    restartUI();
    timeSelection(12, 14);
    cleanRepresentation();
    init();
    svgContainer
      .append("text")
      .text("Only 46 orders were placed between 12 and 14H.")
      .attr("x", 10)
      .attr("y", 50);
  }, 13000);
  t3 = setTimeout(() => {
    restartUI();
    timeSelection(17, 23);
    cleanRepresentation();
    init();
    svgContainer
      .append("text")
      .text("89% of meals are delivered in the evening (between 17H and 23H)")
      .attr("x", 10)
      .attr("y", 80);
  }, 19000);
}
function restaurantClick() {
  buttonClicked = true;
  svgContainer.selectAll("text").remove();
  clearAllTimers();
  t1 = setTimeout(() => {
    restartUI();
    orderSelection(900, 995);
    cleanRepresentation();
    init();
    svgContainer
      .append("text")
      .text("The best restaurant has 995 orders!")
      .attr("x", 10)
      .attr("y", 20);
  }, 1000);
  t2 = setTimeout(() => {
    restartUI();
    orderSelection(1, 10);
    cleanRepresentation();
    init();
    svgContainer
      .append("text")
      .text("50% of restaurants have between 1 and 10 orders.")
      .attr("x", 10)
      .attr("y", 50);
  }, 7000);
  t3 = setTimeout(() => {
    restartUI();
    orderSelection(100, 1000);
    cleanRepresentation();
    init();
    svgContainer
      .append("text")
      .text("3 restaurants share 75% of the orders.")
      .attr("x", 10)
      .attr("y", 80);
  }, 13000);
}
function customerClick() {
  buttonClicked = true;
  svgContainer.selectAll("text").remove();
  clearAllTimers();
  t1 = setTimeout(() => {
    restartUI();
    customerSelection(1, 10);
    cleanRepresentation();
    init();
    svgContainer
      .append("text")
      .text("96% of customers order between 1 and 10 times & 55% only once.")
      .attr("x", 10)
      .attr("y", 20);
  }, 1000);
  t1 = setTimeout(() => {
    restartUI();
    customerSelection(1, 1);
    cleanRepresentation();
    init();
    svgContainer
      .append("text")
      .text("96% of customers order between 1 and 10 times & 55% only once.")
      .attr("x", 10)
      .attr("y", 20);
  }, 7000);
  t2 = setTimeout(() => {
    restartUI();
    customerSelection(10, 20);
    cleanRepresentation();
    init();
    svgContainer
      .append("text")
      .text("20 customers ordered between 10 and 20 times.")
      .attr("x", 10)
      .attr("y", 50);
  }, 13000);
  t3 = setTimeout(() => {
    restartUI();
    customerSelection(20, 30);
    cleanRepresentation();
    init();
    svgContainer
      .append("text")
      .text(
        "Only 1% of customers are regular customers (between 20 & 30 orders)"
      )
      .attr("x", 10)
      .attr("y", 80);
  }, 19000);
  t4 = setTimeout(() => {
    restartUI();
    customerSelection(30, 100);
    cleanRepresentation();
    init();
    svgContainer
      .append("text")
      .text(
        "2 customers have ordered more than 30 times in 13 different restaurants. Thanks to them !"
      )
      .attr("x", 10)
      .attr("y", 110);
  }, 26000);
}
function mapClick() {
  buttonClicked = true;
  svgContainer.selectAll("text").remove();
  clearAllTimers();
  t1 = setTimeout(() => {
    restartUI();
    areaSelection(46.5196535, 6.6322734, 1000);
    cleanRepresentation();
    init();
    svgContainer
      .append("text")
      .text(
        "A quarter of the orders are made in the center of lausanne. (<1km)"
      )
      .attr("x", 10)
      .attr("y", 20);
  }, 1000);
  t2 = setTimeout(() => {
    restartUI();
    areaSelection(46.5196535, 6.6322734, 2000);
    cleanRepresentation();
    init();
    svgContainer
      .append("text")
      .text(
        "Half of the clients are concentrated in the first 2 km around the city center."
      )
      .attr("x", 10)
      .attr("y", 50);
  }, 7000);
  t3 = setTimeout(() => {
    restartUI();
    areaSelection(46.518394, 6.568469, 800);
    cleanRepresentation();
    init();
    svgContainer
      .append("text")
      .text("There are 5 clients on the EPFL campus ! ;)")
      .attr("x", 10)
      .attr("y", 80);
  }, 13000);
}

function clearAllTimers() {
  clearTimeout(t1);
  clearTimeout(t2);
  clearTimeout(t3);
  clearTimeout(t4);
}

function radians(degrees) {
  var pi = Math.PI;
  return degrees * (pi / 180);
}

function getDistance(lat1, lon1, lat2, lon2) {
  var r = EARTH_RADIUS / 1000;
  var dLat = radians(lat2 - lat1); //
  var dLon = radians(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(radians(lat1)) *
      Math.cos(radians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = r * c; // Distance in km
  return d;
}
