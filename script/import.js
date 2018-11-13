function csvImportD3(path, callback) {
  d3.csv(path, function(data) {
    if (typeof data !== "undefined" && data.length > 0) {
      var incr = 0;
      var ending = false;

      console.log("DATA LOADED !");
      data.forEach(function(e) {
        var restToken = true;
        var custToken = true;
        let rest = new Restaurant(incr, e.plat, e.plng, 0);
        let cust = new Customer(incr, e.dlat, e.dlng);

        restaurantList.forEach(function(r) {
          if (rest.lat == r.lat && rest.long == r.long) {
            r.size = r.size + 1;
            restToken = false;
          }
        });
        if (restToken) {
          restaurantList.push(rest);
        }

        customerList.forEach(function(c) {
          if (cust.lat == c.lat && cust.long == c.long) {
            custToken = false;
          }
        });
        if (custToken) {
          customerList.push(cust);
        }
        dist = distance(e.plng, e.plat, e.dlng, e.dlat);
        //TODO : CHANGE REST AND CUST ID IF REST OR CUR ALREADY EXIST
        deliveryList.push(
          new Delivery(incr, rest.id, cust.id, dist, e.t, e.road)
        );
        incr = incr + 1;
        if (incr == data.length) ending = true;
      });
      console.log(
        "RESTAURANT LIST : " + JSON.stringify(restaurantList, 4, null)
      );
      console.log("CUSTOMER LIST : " + JSON.stringify(customerList, 4, null));
      console.log("DELIVERY LIST : " + JSON.stringify(deliveryList, 4, null));

      callback(ending);
    } else {
      console.log("DATA ERROR !");
    }
  });
}
