// import "dotenv/config";
// import * as cheerio from "cheerio";
// import axios from "axios";
// import emailjs from "@emailjs/browser";
// import * as fs from "fs";
require("dotenv").config();
const cheerio = require("cheerio");
const axios = require("axios");
var fs = require("fs");
const emailjs = require("@emailjs/browser");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();
// const readline = require("readline");

let token;
const apiKey = process.env.API_KEY;

var x = 0;
const serviceId = process.env.SERVICE_ID;
const templateId = process.env.TEMPLATE_ID;
const publicKey = process.env.PUBLIC_KEY;

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
  // console.log(bar);
  var apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?fields=opening_hours,website&place_id=${bar["place_id"]}&key=AIzaSyASuJcv2I7IQEN31z6fnFa0SYn1v4SOgic`;
  const response = await fetch(apiUrl);
  const barHours = await response.json();
  var name = bar["name"];
  var hours = await barHours;
  // console.log(hours.result.website);
  if (hours.result.website) {
    // var email = await scrape(hours.result.website);
    if (email) {
      // console.log(email);
    }
  } else {
    var email = null;
  }
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
    console.log(name + " " + saturdayClose);
  }
}

//scrape for emails
async function scrape(url) {
  const webPage = await axios.get(url);
  const $ = cheerio.load(webPage.data);
  var hrefs = $("a[href]")
    .map((i, el) => $(el).attr("href"))
    .get();
  // console.log(hrefs);
  for (let i = 0; i < hrefs.length; i++) {
    // console.log(hrefs[i]);
    if (hrefs[i].includes("mailto:")) {
      var email = hrefs[i].split(":").pop().split(".com").shift() + ".com";
      console.log(email);
      return email;
    } else {
      // console.log("no email");
      // return "no email";
    }
  }
}

function sendMail(email) {
  // if (lineByLine(email)) {
  //   return;
  // }
  var params = {
    bar_email: email,
  };
  emailjs.send(serviceId, templateId, params, publicKey).then(
    function (response) {
      console.log("SUCCESS!", response.status, response.text);
    },
    function (error) {
      console.log("FAILED...", error);
    }
  );
  fs.writeFile("./emails.txt", email, (err) => {
    if (err) throw err;
  });
}

async function lineByLine(email) {
  const fileStream = fs.createReadStrean("emails.txt");
  // const rl = readline.createInterface({
  //   input: fileStream,
  //   crlfDelay: Infinity,
  // });
  for await (const line of rl) {
    if (line === email) {
      return true;
    }
  }
}

// $('a[href]')
//   .each(function () {
//     var linkString = $(this).attr("href");
//     console.log(linkString);
//     if (linkString) {
//       if (linkString.includes("mailto:")) {
//         console.log($(this).attr("href"));
//         var email = $(this).attr("href").split(":").pop();
//         // console.log(email);
//         return email;
//       } else {
//         return "no email";
//       }
//     }
//   });
// }

// logBars();
// scrape();
sendMail("graphicbalance6@gmail.com");
