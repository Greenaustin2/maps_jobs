const { main } = require("./main.cjs");
require("dotenv").config();
const cheerio = require("cheerio");
const axios = require("axios");
var fs = require("fs");
const readline = require("readline");

let token;
const apiKey = process.env.API_KEY;

// var x = 0;
// const serviceId = process.env.SERVICE_ID;
// const templateId = process.env.TEMPLATE_ID;
// const publicKey = process.env.PUBLIC_KEY;

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

async function logBars() {
  var latLong = "40.712132, -73.962143";
  var miles = 1;
  var query = "art+gallery";

  var radius = (miles * 1609).toString();
  var latitude = latLong.split(",")[0];
  var longitude = latLong.split(",")[1].slice(1);
  // var closingTime = "2";

  const api = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${apiKey}&location=${latitude}%2C${longitude}&radius=${radius}`;
  // console.log(api);
  const response = await fetch(api);
  const bars = await response.json();
  // console.log(await bars);

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
  var apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?fields=opening_hours,website&place_id=${bar["place_id"]}&key=AIzaSyASuJcv2I7IQEN31z6fnFa0SYn1v4SOgic`;
  const response = await fetch(apiUrl);
  const barHours = await response.json();
  var name = bar["name"];
  var hours = await barHours;

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
  // check if hours are available
  if (saturdayClose === "no hours") {
    // check if closed saturdays
  } else if (hours.result.opening_hours.weekday_text[5] === "Closed") {
    var saturdayClose = "closed";
    //filter for specified time frame
  } else if (
    (closingInteger >= 1 && closingInteger <= 5) ||
    (closingInteger >= 9 && closingInteger <= 12)
  ) {
    console.log(name + " " + saturdayClose);
    // check if a website is available
    if (hours.result.website) {
      //scrape web page for email address
      var email = await scrape(hours.result.website);
      console.log(email);
      //if email address is available, call gmail api with email address
      if (email) {
        // send to lineByLine before calling google api
        if (await lineByLine(email)) {
          //call google api with email address
          await main(email).then((messageId) =>
            console.log("message sent succesfully" + messageId)
          );
        }
      }
    }
  }
}

//scrape for emails
async function scrape(url) {
  const webPage = await axios.get(url);
  const $ = cheerio.load(webPage.data);
  var hrefs = $("a[href]")
    .map((i, el) => $(el).attr("href"))
    .get();
  console.log("hrefs" + hrefs);
  for (let i = 0; i < hrefs.length; i++) {
    if (hrefs[i].includes("mailto:")) {
      console.log(hrefs[i]);
      var email = hrefs[i].split(":").pop().split(".com").shift() + ".com";
      console.log(email);
      return email;
    }
  }
  return false;
}

// compare email to email address records and confirm if present or not
// if email is not present then it is added to the records and returns true
async function lineByLine(email) {
  const fileStream = fs.createReadStream("emails.txt");
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  //read emails.txt file line by line to confirm if address will be repeated
  for await (var line of rl) {
    // console.log("line: " + line);
    // console.log("email: " + email);
    if (line === email) {
      console.log("if statement" + line);
      return false;
    }
  }
  //write email to emails.txt file
  var stream = fs.createWriteStream("emails.txt", { flags: "a" });
  stream.write(email + "\n");
  return true;
}

logBars();
