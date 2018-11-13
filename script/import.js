function csvImportD3(path, callback) {
  d3.csv(path, function(data) {
    if (typeof data !== "undefined" && data.length > 0) {
      var incr = 0;
      var ending = false;

      console.log("DATA LOADED !");
      data.forEach(function(e) {
        var restIndex = restaurantList.findIndex(
          x => x.lat == e.plat && x.long == e.plng
        );
        var custIndex = customerList.findIndex(
          x => x.lat == e.dlat && x.long == e.dlng
        );
        if (restIndex == -1) {
          rest = new Restaurant(incr, e.plat, e.plng, 1);
          restaurantList.push(rest);
        } else {
          rest = restaurantList[restIndex];
          rest.size = rest.size + 1;
        }
        if (custIndex == -1) {
          cust = new Customer(incr, e.dlat, e.dlng);
          customerList.push(cust);
        } else {
          cust = customerList[custIndex];
        }
        dist = distance(rest.long, rest.lat, cust.long, cust.lat);
        delivery = new Delivery(incr, rest.id, cust.id, dist, e.t, e.road);
        deliveryList.push(delivery);

        incr = incr + 1;
        if (incr == data.length) ending = true;
      });
      console.log("DELIVERY SIZE : " + deliveryList.length);
      console.log("RESTAURANT SIZE : " + restaurantList.length);
      console.log("CUSTOMER SIZE : " + customerList.length);
      callback(ending);
    } else {
      console.log("DATA ERROR !");
    }
  });
}
