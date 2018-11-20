var width = 640,
  height = 480;

var animationStep = 400;

var force1 = null,
  force2 = null,
  nodes1 = null,
  nodes2 = null,
  links1 = null,
  links2 = null;

var svg = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

var initForce = function() {
  svg.selectAll("*").remove();
  var dataNodes1 = [
    { x: (4 * width) / 10, y: (6 * height) / 9 },
    { x: (6 * width) / 10, y: (6 * height) / 9 },
    { x: width / 2, y: (7 * height) / 9 },
    { x: (4 * width) / 10, y: (7 * height) / 9 },
    { x: (6 * width) / 10, y: (7 * height) / 9 },
    { x: width / 2, y: (5 * height) / 9 }
  ];

  var dataLinks1 = [
    { source: 0, target: 1 },
    { source: 1, target: 2 },
    { source: 2, target: 0 }
  ];

  force1 = d3.layout
    .force()
    .size([width, height])
    .nodes(dataNodes1)
    .links(dataLinks1);

  force1.linkDistance(height / 2);

  links1 = svg
    .selectAll(".link1")
    .data(dataLinks1)
    .enter()
    .append("line")
    .attr("class", "link1")
    .attr("x1", function(d) {
      return dataNodes1[d.source].x;
    })
    .attr("y1", function(d) {
      return dataNodes1[d.source].y;
    })
    .attr("x2", function(d) {
      return dataNodes1[d.target].x;
    })
    .attr("y2", function(d) {
      return dataNodes1[d.target].y;
    });

  nodes1 = svg
    .selectAll(".node1")
    .data(dataNodes1)
    .enter()
    .append("circle")
    .attr("class", "node1")
    .attr("r", width / 40)
    .attr("cx", function(d) {
      return d.x;
    })
    .attr("cy", function(d) {
      return d.y;
    });

  force1.on("tick", stepForce1);
};

var stepForce1 = function() {
  nodes1
    .attr("cx", function(d) {
      return d.x;
    })
    .attr("cy", function(d) {
      return d.y;
    });

  links1
    .attr("x1", function(d) {
      return d.source.x;
    })
    .attr("y1", function(d) {
      return d.source.y;
    })
    .attr("x2", function(d) {
      return d.target.x;
    })
    .attr("y2", function(d) {
      return d.target.y;
    });
};

d3.select("#advance").on("click", function() {
  force1.start();
  force2.start();
});

initForce();
