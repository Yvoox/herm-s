function csvImportD3(path) {
  d3.csv(path, function(data) {
    if (typeof data !== "undefined" && data.length > 0) {
      var incr = 0;
      console.log("DATA LOADED !");
      data.forEach(function(e) {
        restaurantList.push(new Restaurant(incr, e.plat, e.plong));
        customerList.push(new Customer(incr, e.dlat, e.dlong));
        //deliveryList.append(new Devivery(incr, incr, e.dist, e.t, e.road));
        incr = incr + 1;
      });
    } else {
      console.log("DATA ERROR !");
    }
  });
  //  console.log("RESTAURANT LIST : " + JSON.stringify(restaurantList, 4, null));
  //  console.log("CUSTOMER LIST : " + JSON.stringify(customerList, 4, null));
}
