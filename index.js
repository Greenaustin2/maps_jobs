const API =
  "https://maps.googleapis.com/maps/api/place/textsearch/json?query=bar&key=AIzaSyASuJcv2I7IQEN31z6fnFa0SYn1v4SOgic&latitude=40.713012&longitude=-73.961638&radius=6500";
let token;
var x = 0;

async function logBars() {
  const response = await fetch(API);
  const bars = await response.json();
  for (let i = 0; i < bars["results"].length - 1; i++) {
    await logHours(bars["results"][i]);
  }
  token = bars.next_page_token;
  const tokenResponse = await fetch(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?key=AIzaSyASuJcv2I7IQEN31z6fnFa0SYn1v4SOgic&pagetoken=${token}`
  );
  const bars2 = await tokenResponse.json();
  for (let i = 0; i < bars2["results"].length - 1; i++) {
    await logHours(bars2["results"][i]);
  }
  token = bars2.next_page_token;
  const tokenResponse2 = await fetch(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?key=AIzaSyASuJcv2I7IQEN31z6fnFa0SYn1v4SOgic&pagetoken=${token}`
  );
  const bars3 = await tokenResponse2.json();
  for (let i = 0; i < bars3["results"].length - 1; i++) {
    await logHours(bars3["results"][i]);
  }
}

// const consoleLog = (bars) => {
//   console.log(x);
//   for (let i = 0; i < bars["results"].length - 1; i++) {
//     logHours(bars["results"][i]);
//   }
//   x += 1;
// };

// async function nextPageToken(token) {
//   const tokenResponse = await fetch(
//     `https://maps.googleapis.com/maps/api/place/textsearch/json?key=AIzaSyASuJcv2I7IQEN31z6fnFa0SYn1v4SOgic&pagetoken=${token}`
//   );
//   const bars = await tokenResponse.json();
//   // console.log(bars);
//   consoleLog(bars);
//   token = bars.next_page_token;
//   const tokenResponse2 = await fetch(
//     `https://maps.googleapis.com/maps/api/place/textsearch/json?key=AIzaSyASuJcv2I7IQEN31z6fnFa0SYn1v4SOgic&pagetoken=${token}`
//   );
//   const bars2 = await tokenResponse2.json();
//   consoleLog(bars2);
// }

async function logHours(bar) {
  var apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?fields=opening_hours&place_id=${bar["place_id"]}&key=AIzaSyASuJcv2I7IQEN31z6fnFa0SYn1v4SOgic`;
  const response = await fetch(apiUrl);
  const barHours = await response.json();
  var name = bar["name"];
  var hours = await barHours;
  if (hours.result.opening_hours.weekday_text[5] === "Closed") {
    var saturdayClose = "closed";
  } else {
    var saturdayHours = hours.result.opening_hours.weekday_text[5];
    var saturdayClose = saturdayHours.substring(
      saturdayHours.length - 8,
      saturdayHours.length
    );
  }
  console.log(name + " " + saturdayClose);
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
