// Radius of the earth in meters
let EARTH_RADIUS = 6371000;
let width = window.innerWidth - 20,
  height = window.innerHeight - 100;

let message =
  "Welcome to our Visualization ! Choose a section to show interesting facts inside 2000 delivries, 32 restaurants & 528 customers";

let nodes = [];
let dataPath;
let importRestaurantList = [];
let importCustomerList = [];
let importDeliveryList = [];
let restaurantList = [];
let customerList = [];
let deliveryList = [];
let dataLinks = [];
let viewType = false; //false -> graph, true -> geographical
let memoryView = false;

//Drawer
let svgContainer;
let drawedNode = null;
let links = null;
let force = null;
let rectangleLabel;

let t1, t2, t3, t4;
let buttonClicked = false;
var colors = {
  restaurant: "red",
  customer: "#000000"
};
