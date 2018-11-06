class Customer {
  constructor(id, lat, long) {
    this.id = id;
    this.lat = lat;
    this.long = long;
  }

  toString() {
    let toString =
      "ID: " + this.id + " LATITUDE: " + this.lat + " LONGITUDE: " + this.long;
    return toString;
  }

  print() {
    console.log(this.toString());
  }
}

class Restaurant {
  constructor(id, lat, long) {
    this.id = id;
    this.lat = lat;
    this.long = long;
  }

  toString() {
    let toString =
      "ID: " + this.id + " LATITUDE: " + this.lat + " LONGITUDE: " + this.long;
    return toString;
  }

  print() {
    console.log(this.toString());
  }
}

class Delivery {
  constructor(id, restaurantId, customerId, dist, t, road) {
    this.id = id;
    this.restaurantId = restaurantId;
    this.customerId = customerId;
    this.dist = dist;
    this.t = t;
    this.road = road;
  }

  toString() {
    let toString =
      "ID: " +
      this.id +
      " RESTAURANT: " +
      this.restaurantId +
      " CUSTOMER: " +
      this.customerId +
      " DISTANCE: " +
      this.dist +
      " TIME: " +
      this.t +
      " ROAD:" +
      this.road;
    return toString;
  }

  print() {
    console.log(this.toString());
  }
}
