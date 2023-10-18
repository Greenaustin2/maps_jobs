const API =
  "https://maps.googleapis.com/maps/api/place/textsearch/json?query=bar&key=AIzaSyASuJcv2I7IQEN31z6fnFa0SYn1v4SOgic&latitude=40.713012&longitude=-73.961638&radius=6500";

async function logBars() {
  const response = await fetch(API);
  const bars = await response.json();
  for (let i = 0; i < bars["results"].length - 1; i++) {
    logHours(bars["results"][i]);
  }
}

async function logHours(bar) {
  var apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?fields=opening_hours&place_id=${bar["place_id"]}&key=AIzaSyASuJcv2I7IQEN31z6fnFa0SYn1v4SOgic`;
  const response = await fetch(apiUrl);
  const barHours = await response.json();
  var name = bar["name"];
  var hours = await barHours;
  var hoursString = JSON.stringify(hours);
  var saturdayHours = hours.result.opening_hours.periods[5].close.time;
  //   console.log(hours.result.opening_hours.periods[5].close.time);
  if (saturdayHours === "0200") {
    console.log("name: " + name);
  }
}

logBars();

// import pkg from "@googlemaps/js-api-loader";
// const { Loader } = pkg;
// const loader = new Loader({
//   apiKey: "AIzaSyASuJcv2I7IQEN31z6fnFa0SYn1v4SOgic",
//   version: "weekly",
// });

// let map;
// var service;
// // var infowindow;

// loader.importLibrary().then(async () => {
//   const { Places } = await google.maps.importLibrary("places");

// //   map = new Map(document.getElementById("map"), {
// //     center: { lat: -34.397, lng: 150.644 },
// //     zoom: 8,
// //   });

// var pyrmont = new google.maps.LatLng(-33.8665433,151.1956316);

// map = new google.maps.Map(document.getElementById('map'), {
//     center: pyrmont,
//     zoom: 15
//   });

// var request = {
//   location: pyrmont,
//   radius: '6500',
//   query: 'bar'
// };

// service = new google.maps.places.PlacesService(map);
// service.textSearch(request, callback);

// });

// function callback(results, status) {
//     if (status == google.maps.places.PlacesServiceStatus.OK) {
//       for (var i = 0; i < results.length; i++) {
//         var place = results[i];
//         // createMarker(results[i]);
//         // console.log(place)
//       }
//     }
//     }
