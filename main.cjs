const fs = require("fs");
const path = require("path");
const sendMail = require("./gmail.cjs");

// async function main(emailAddress) {
//   const fileAttachments = [
//     {
//       path: "./Agreen_bartender_cv.pdf",
//     },
//   ];

//   const options = {
//     to: emailAddress,
//     cc: "",
//     subject: "Austin Green - Bartender",
//     text: "I live in Ridgewood and am on the hunt for new opportunities in the area. Would love to be a part of the team if there is ever an opening. Hope to hear from you!    ",
//     attachments: fileAttachments,
//     textEncoding: "base64",
//     headers: [
//       { key: "X-Application-Developer", value: "Austin Green" },
//       { key: "X-Application-Version", value: "v1.0.0.2" },
//     ],
//   };

//   const messageId = await sendMail(options);
//   return messageId;
// }
function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main(emailAddress) {
  await timeout(3000);
  console.log("email address from main function: " + emailAddress);
  return "lksdajflksdjflkjdslfkjsdlkjflkjsdlkfjsdlk";
}

module.exports = { main };
// main()
//   .then((messageId) => console.log('Message sent successfully:', messageId))
//   .catch((err) => console.error(err));
