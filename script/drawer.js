function createSVGContainer(div) {
  //Make an SVG Container
  svgContainer = d3
    .select("body")
    .append("svg")
    .attr("width", 200)
    .attr("height", 200);
}

function createCircle(x, y, r) {
  //Draw the Circle
  var circle = svgContainer
    .append("circle")
    .attr("cx", x)
    .attr("cy", y)
    .attr("r", r);
}

function createNodes(list) {
  var nodes;
  var token;
  if (typeof list[0].size !== "undefined") {
    console.log("DRAW RESTAURANTS");
    token = "restaurant";
    (nodes = list.map(function(e) {
      return { radius: e.size, x: e.lat, y: e.long };
    })),
      (root = nodes[0]),
      (color = d3.scale.category10());
  } else {
    console.log("DRAW CUSTOMERS");
    token = "customer";
    (nodes = list.map(function(e) {
      return { radius: 10, x: e.lat, y: e.long };
    })),
      (root = nodes[0]),
      (color = d3.scale.category10());
  }

  root.radius = 0;
  root.fixed = true;

  var drag = d3.behavior
    .drag()
    .on("drag", dragmove)
    .origin(function() {
      var t = d3.transform(d3.select(this).attr("transform"));
      return { x: t.translate[0], y: t.translate[1] };
    });

  svg
    .selectAll("circle")
    .data(nodes.slice(2))
    .enter()
    .append("circle")
    .attr("r", function(d) {
      return d.radius;
    })
    .attr("cx", function(d) {
      return d.x * 10;
    })
    .attr("cy", function(d) {
      return d.y * 10;
    })
    .style("fill", function(d, i) {
      if (token == "restaurant") return color(i % 3);
      else if (token == "customer") return "grey";
    })
    .call(drag);

  console.log("NODES: " + JSON.stringify(nodes, 4, null));
}

function dragmove(d) {
  var x = d3.event.x;
  var y = d3.event.y;
  d3.select(this).attr("transform", "translate(" + x + "," + y + ")");
}
