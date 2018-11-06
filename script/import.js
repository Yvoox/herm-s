function csvImportD3(path) {
  d3.csv(path, function(data) {
    if (typeof data !== "undefined" && data.length > 0) {
      var incr = 0;

      console.log("DATA LOADED !");
      data.forEach(function(e) {
        var restToken = true;
        var custToken = true;
        let rest = new Restaurant(incr, e.plat, e.plong);
        let cust = new Customer(incr, e.dlat, e.dlong);

        restaurantList.forEach(function(r) {
          if (rest.lat == r.lat && rest.long == r.long) {
            r.size = r.size + 1;
            restToken = false;
          }
        });
        if (restToken) {
          restaurantList.push(new Restaurant(incr, e.plat, e.plong, 0));
        }

        customerList.forEach(function(c) {
          if (cust.lat == c.lat && cust.long == c.long) {
            custToken = false;
          }
        });
        if (custToken) {
          customerList.push(new Customer(incr, e.dlat, e.dlong));
        }
        dist = distance(e.plong, e.plat, e.dlong, e.dlat);
        deliveryList.push(new Delivery(incr, incr, dist, e.t, e.road));
        incr = incr + 1;
      });
      console.log(
        "RESTAURANT LIST : " + JSON.stringify(restaurantList, 4, null)
      );
      console.log("CUSTOMER LIST : " + JSON.stringify(customerList, 4, null));
    } else {
      console.log("DATA ERROR !");
    }
  });
}
