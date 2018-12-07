function createSVGContainer() {
  //Make an SVG Container
  svgContainer = d3
    .select("#main")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .on("click", function() {
      d3.selectAll("#text").remove();
      d3.select("#label").remove();
      if (JSON.stringify(d3.select("#mySidenav"), 4, null) != "[[null]]")
        closeNav();
    })
    .call(
      d3.behavior.zoom().on("zoom", function() {
        svgContainer.attr(
          "transform",
          "translate(" +
            d3.event.translate +
            ")" +
            " scale(" +
            d3.event.scale +
            ")"
        );
      })
    );
  rectangleLabel = svgContainer
    .append("rect")
    .attr("id", "label")
    .attr("opacity", 100);
}

function createCircle(x, y, r) {
  //Draw the Circle
  var circle = svgContainer
    .append("circle")
    .attr("cx", x)
    .attr("cy", y)
    .attr("r", r);
}

function createLinks(list, callback) {
  if (viewType) {
    callback(true);
  } else {
    var ending = false;
    var newTab = list.map(function(e) {
      l1 = searchId("r" + e.restaurantId);
      l2 = searchId("c" + e.customerId);
      temp = { source: l1, target: l2 };
      dataLinks.push(temp);
    });

    if (newTab.length == list.length) {
      ending = true;
      console.log("DATALINKS : " + JSON.stringify(dataLinks, 4, null));
      callback(ending);
    }
  }
}

function createNodes(list) {
  if (typeof list[0].size !== "undefined") {
    console.log("DRAW RESTAURANTS");
    if (!viewType) {
      var tempNodes = list.map(function(e) {
          var size = 0;
          if (e.size < 10) {
            size = 2;
          } else if (e.size > 10 && e.size < 50) {
            size = 5;
          } else {
            size = 8;
          }
          return {
            radius: size,
            x: parseInt(e.lat),
            y: parseInt(e.long),
            data: "r" + e.id,
            object: e
          };
        }),
        root = tempNodes[0],
        color = d3.scale.category10();
    } else {
      var tempNodes = list.map(function(e) {
          var size = 0;
          if (e.size < 10) {
            size = 2;
          } else if (e.size > 10 && e.size < 50) {
            size = 5;
          } else {
            size = 8;
          }

          return {
            radius: size,
            x: e.lat,
            y: e.long,
            data: "r" + e.id,
            object: e
          };
        }),
        root = tempNodes[0],
        color = d3.scale.category10();
    }
  } else {
    console.log("DRAW CUSTOMERS");
    var tempNodes = list.map(function(e) {
        return { radius: 2, x: e.lat, y: e.long, data: "c" + e.id, object: e };
      }),
      root = tempNodes[0],
      color = d3.scale.category10();
  }

  nodes = nodes.concat(tempNodes);

  //console.log("NODES: " + JSON.stringify(nodes, 4, null));
}

function drawInContainer() {
  /*var drag = d3.behavior
    .drag()
    .on("drag", dragmove)
    .origin(function() {
      var t = d3.transform(d3.select(this).attr("transform"));
      return { x: t.translate[0], y: t.translate[1] };
    });*/

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

  if (!viewType) {
    force = d3.layout
      .force()
      .size([width, height])
      .nodes(nodes)
      .links(dataLinks);
    force.linkDistance(height / 4);

    links = svgContainer
      .selectAll(".links")
      .data(dataLinks)
      .enter()
      .append("line")
      .attr("class", "links")
      .attr("x1", function(d) {
        //console.log(d.source);
        return nodes[d.source].x;
      })
      .attr("y1", function(d) {
        return nodes[d.source].y;
      })
      .attr("x2", function(d) {
        return nodes[d.target].x;
      })
      .attr("y2", function(d) {
        return nodes[d.target].y;
      })
      .attr("stroke", "black")
      .attr("stroke-width", 0.1);
  }

  drawedNode = svgContainer
    .selectAll(".drawedNode")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("class", "drawedNode")
    .attr("cx", function(d) {
      return pointX_to_svgX(d.x);
    })
    .attr("cy", function(d) {
      return pointY_to_svgY(d.y);
    })
    .attr("r", function(d) {
      return d.radius;
    })
    .style("fill", function(d, i) {
      if (d.data.includes("r")) return "red";
    })
    .attr("data", function(d) {
      return d.data;
    })
    .on("click", function(d) {
      displayInformations(d);
    });
  //.call(drag);

  console.log("NODES : " + JSON.stringify(nodes, 4, null));
  console.log("SVGCONTAINER : " + JSON.stringify(svgContainer, 4, null));
  console.log("DRAWEDNODE : " + JSON.stringify(drawedNode, 4, null));

  if (!viewType) {
    force.on("tick", forceUpdate);
    force.start();
  }
}

function forceUpdate() {
  if (!viewType) {
    drawedNode
      .attr("cx", function(d) {
        return parseInt(d.x);
      })
      .attr("cy", function(d) {
        return parseInt(d.y);
      });

    links
      .attr("x1", function(d) {
        return parseInt(d.source.x);
      })
      .attr("y1", function(d) {
        return parseInt(d.source.y);
      })
      .attr("x2", function(d) {
        return parseInt(d.target.x);
      })
      .attr("y2", function(d) {
        return parseInt(d.target.y);
      });
  }
}

function dragmove(d) {
  var x = d3.event.x;
  var y = d3.event.y;
  d3.select(this).attr("transform", "translate(" + x + "," + y + ")");
  if (!viewType) forceUpdate();
}

function initCreation(callback) {
  var ending = false;
  createSVGContainer();
  createNodes(restaurantList);
  createNodes(customerList);
  if (!buttonClicked) initText();

  createLinks(deliveryList, function(call) {
    if (call) {
      ending = true;
      callback(ending);
    }
  });
}

function updateUI() {
  let hourStart = d3.select("#hourStart").property("value");
  let hourEnd = d3.select("#hourEnd").property("value");
  let orderMin = d3.select("#orderMin").property("value");
  let orderMax = d3.select("#orderMax").property("value");
  let orderMinC = d3.select("#orderMinC").property("value");
  let orderMaxC = d3.select("#orderMaxC").property("value");
  let longitude = d3.select("#longitude").property("value");
  let latitude = d3.select("#latitude").property("value");
  let radius = d3.select("#radius").property("value");

  if (longitude != "" && latitude != "" && radius != "") {
    areaSelection(latitude, longitude, radius);
    cleanRepresentation();
    init();
  }

  if (hourStart != "" && hourEnd != "" && hourStart < hourEnd) {
    timeSelection(hourStart, hourEnd);
    cleanRepresentation();

    init();
  } else {
    restaurantList = importRestaurantList;
    customerList = importCustomerList;
    deliveryList = importDeliveryList;
  }
  if (orderMin != "" && orderMax != "") {
    orderSelection(orderMin, orderMax);
    cleanRepresentation();
    init();
  }
  if (orderMinC != "" && orderMaxC != "") {
    customerSelection(orderMinC, orderMaxC);
    cleanRepresentation();
    init();
  }
  viewType = d3.select("#reprType").property("checked");
  if (typeof svgContainer !== "undefined" && viewType != memoryView) {
    //svgContainer.selectAll("*").remove();
    memoryView = viewType;
    cleanRepresentation();
    init();
  }
}

function restartUI() {
  d3.select("#hourStart").property("value", "");
  d3.select("#hourEnd").property("value", "");
  d3.select("#orderMin").property("value", "");
  d3.select("#orderMax").property("value", "");
  d3.select("#orderMinC").property("value", "");
  d3.select("#orderMaxC").property("value", "");
  d3.select("#longitude").property("value", "");
  d3.select("#latitude").property("value", "");
  d3.select("#radius").property("value", "");
  customerList = importCustomerList;
  restaurantList = importRestaurantList;
  deliveryList = importDeliveryList;
  cleanRepresentation();
  init();
}

function drawLegend() {
  // Dimensions of legend item: width, height, spacing, radius of rounded rect.
  var li = {
    w: 100,
    h: 30,
    s: 3,
    r: 3
  };

  var legend = d3
    .select("#legend")
    .append("svg:svg")
    .attr("width", li.w)
    .attr("height", d3.keys(colors).length * (li.h + li.s));

  var g = legend
    .selectAll("g")
    .data(d3.entries(colors))
    .enter()
    .append("svg:g")
    .attr("transform", function(d, i) {
      return "translate(0," + i * (li.h + li.s) + ")";
    });

  g.append("svg:rect")
    .attr("rx", li.r)
    .attr("ry", li.r)
    .attr("width", li.w)
    .attr("height", li.h)
    .style("fill", function(d) {
      return d.value;
    });

  g.append("svg:text")
    .attr("x", li.w / 2)
    .attr("y", li.h / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", "middle")
    .text(function(d) {
      return d.key;
    });
}
