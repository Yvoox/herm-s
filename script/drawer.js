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

function createNodes() {
  var width = window.innerWidth,
    height = window.innerHeight;

  var nodes = restaurantList.map(function(e) {
      return { radius: e.size, x: e.lat, y: e.long };
    }),
    root = nodes[0],
    color = d3.scale.category10();

  root.radius = 0;
  root.fixed = true;

  var svg = d3
    .select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

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
      return color(i % 3);
    });

  console.log("NODES: " + JSON.stringify(nodes, 4, null));
}
