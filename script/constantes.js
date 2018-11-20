// Radius of the earth in meters
let EARTH_RADIUS = 6371000;
let width = window.innerWidth,
  height = window.innerHeight;

let nodes = [];
let dataPath;
let restaurantList = [];
let customerList = [];
let deliveryList = [];
let dataLinks = [];
let viewType = false; //false -> graph, true -> geographical

//Drawer
let svgContainer;
let drawedNode = null;
let links = null;
let force = null;
