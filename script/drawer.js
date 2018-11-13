function createSVGContainer() {
  //Make an SVG Container
  svgContainer = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
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

function createNodes(list) {
  var token;
  if (typeof list[0].size !== "undefined") {
    console.log("DRAW RESTAURANTS");
    token = "restaurant";
    var tempNodes = list.map(function(e) {
        var size = 10;
        if (e.size < 10) {
          size = 10;
        } else if (e.size > 10 && e.size < 50) {
          size = 30;
        } else {
          size = 50;
        }
        return {
          radius: size,
          x: parseInt(e.lat),
          y: parseInt(e.long),
          data: "r" + e.id
        };
      }),
      root = tempNodes[0],
      color = d3.scale.category10();
  } else {
    console.log("DRAW CUSTOMERS");
    token = "customer";
    (nodes = list.map(function(e) {
      return { radius: 2, x: e.lat, y: e.long };
    })),
      (root = nodes[0]),
      (color = d3.scale.category10());
  }

  nodes = nodes.concat(tempNodes);

  //console.log("NODES: " + JSON.stringify(nodes, 4, null));
}

function drawInContainer() {
  var drag = d3.behavior
    .drag()
    .on("drag", dragmove)
    .origin(function() {
      var t = d3.transform(d3.select(this).attr("transform"));
      return { x: t.translate[0], y: t.translate[1] };
    });

    const x_value_range = [d3.min(nodes.slice(2), d => d.x), d3.max(nodes.slice(2), d => d.x)];
    const y_value_range = [d3.min(nodes.slice(2), d => d.y), d3.max(nodes.slice(2), d => d.y)];
    /*console.log(x_value_range);
    console.log(y_value_range);
    console.log(d3.min(nodes.slice(2), d => d.radius));
    console.log(d3.max(nodes.slice(2), d => d.radius));*/

		const pointX_to_svgX = d3.scale.linear()
			.domain(x_value_range)
			.range([0, width]);

		const pointY_to_svgY = d3.scale.linear()
			.domain(y_value_range)
			.range([height, 0]);

    svg
      .selectAll("circle")
      .data(nodes.slice(2))
      .enter()
      .append("circle")
      .attr("r", function(d) {
        if (d.radius > 100) {
          return 8;
        }
        else if (d.radius > 50) {
          return 5;
        }
        else {
          return 2;
        }
      })
      .attr("cx", function(d) {
        return pointX_to_svgX(d.x);
      })
      .attr("cy", function(d) {
        return pointY_to_svgY(d.y);
      })
      .style("fill", function(d, i) {
        if (token == "restaurant") return color(i % 3);
        else if (token == "customer") return "grey";
      })
      .call(drag);
  /*svg
    .selectAll("circle")
    .data(nodes.slice(2))
    .enter()
    .append("line")
    .attr("class", "links")
    .attr("x1", function(d) {
      console.log(d.source);
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
    .attr("stroke", "black") // add this line
    .attr("stroke-width", 2);

  drawedNode = svgContainer
    .selectAll(".drawedNode")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("class", "drawedNode")
    .attr("cx", function(d) {
      return d.x * 10;
    })
    .attr("cy", function(d) {
      return d.y * 10;
    })
    .attr("r", function(d) {
      return d.radius;
    })
    .style("fill", function(d, i) {
      if (d.data.includes("r")) return "red";
      else if (d.data.includes("r")) return "grey";
    })
    .attr("data", function(d) {
      return d.data;
    })
    .call(drag);*/

  force.on("tick", forceUpdate);
  console.log("NODES : " + JSON.stringify(nodes, 4, null));
  console.log("SVGCONTAINER : " + JSON.stringify(svgContainer, 4, null));

  console.log("DRAWEDNODE : " + JSON.stringify(drawedNode, 4, null));

  force.start();
}

function forceUpdate() {
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

function dragmove(d) {
  var x = d3.event.x;
  var y = d3.event.y;
  d3.select(this).attr("transform", "translate(" + x + "," + y + ")");
  forceUpdate();
}

function initCreation(callback) {
  var ending = false;
  createSVGContainer();
  createNodes(restaurantList);
  createNodes(customerList);
  createLinks(deliveryList, function(call) {
    if (call) {
      ending = true;
      callback(ending);
    }
  });
  svgContainer.selectAll(".link1")[0].forEach(function(x) {
    console.log(x);
  });
}
