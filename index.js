import "dotenv/config";
import * as cheerio from "cheerio";
import { default as axios } from "axios";

let token;
const apiKey = process.env.API_KEY;

var x = 0;

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

async function logBars() {
  var latLong = "40.712132, -73.962143";
  var miles = 1;

  var radius = (miles * 1609).toString();
  var latitude = latLong.split(",")[0];
  var longitude = latLong.split(",")[1].slice(1);
  // var closingTime = "2";

  const api = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=bar&key=${apiKey}&location=${latitude}%2C${longitude}&radius=${radius}`;
  // console.log(api);
  const response = await fetch(api);
  const bars = await response.json();
  console.log(await bars);

  for (let i = 0; i < bars["results"].length - 1; i++) {
    await logHours(await bars["results"][i]);
  }
  token = await bars.next_page_token;
  await sleep(2000);
  const tokenResponse = await fetch(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?key=${apiKey}&pagetoken=${token}`
  );
  const bars2 = await tokenResponse.json();

  for (let i = 0; i < bars2["results"].length - 1; i++) {
    await logHours(await bars2["results"][i]);
  }
  token = await bars2.next_page_token;
  await sleep(2000);
  const tokenResponse2 = await fetch(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?key=${apiKey}&pagetoken=${token}`
  );
  const bars3 = await tokenResponse2.json();

  for (let i = 0; i < bars3["results"].length - 1; i++) {
    await logHours(await bars3["results"][i]);
  }
}

async function logHours(bar) {
  // console.log(bar);
  var apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?fields=opening_hours,website&place_id=${bar["place_id"]}&key=AIzaSyASuJcv2I7IQEN31z6fnFa0SYn1v4SOgic`;
  const response = await fetch(apiUrl);
  const barHours = await response.json();
  var name = bar["name"];
  var hours = await barHours;
  console.log(hours.result.website);
  scrape(hours.result.website);
  //take saturday closing time and reduce from timecode string to single integer
  if (!hours.result.opening_hours) {
    var saturdayClose = "no hours";
  } else {
    var saturdayHours = hours.result.opening_hours.weekday_text[5];

    var saturdayClose = saturdayHours.substring(
      saturdayHours.length - 8,
      saturdayHours.length
    );
    var closingInteger = parseInt(saturdayClose.split(/:| /)[0]);
  }
  // check if hours available
  if (saturdayClose === "no hours") {
    console.log(name + " " + saturdayClose);
    // check if closed saturdays
  } else if (hours.result.opening_hours.weekday_text[5] === "Closed") {
    var saturdayClose = "closed";
    console.log(name + " " + saturdayClose);
    //filter for specified time
  } else if (
    (closingInteger >= 1 && closingInteger <= 5) ||
    (closingInteger >= 9 && closingInteger <= 12)
  ) {
    // console.log(closingInteger);
    console.log(name + " " + saturdayClose);
  }
}

async function scrape() {
  const webPage = await axios.get("https://radegasthall.com/");
  const $ = cheerio.load(webPage);
  const emailAddress = $("a").find();
  console.log(emailAddress._root.children);
}

// logBars();
scrape();
