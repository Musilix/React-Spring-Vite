// grab the users "uid" cookie -if it exists - and then clear said cookie

const cookie = require("cookie");
const { __clearCookieOptions__ } = require("../src/constants");

exports.handler = async (event, context) => {
  const userCookie = cookie.parse(event.headers.cookie || "");
  const token = userCookie.uid;

  if (!token) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: "You're already logged out!",
    };
  }

  const emptyCookie = cookie.serialize("uid", "", __clearCookieOptions__);

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": emptyCookie,
    },
    body: JSON.stringify({ message: "You've been logged out!" }),
  };
};
