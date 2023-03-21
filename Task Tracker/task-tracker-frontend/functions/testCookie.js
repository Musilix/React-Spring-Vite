const cookie = require("cookie");

const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.handler = async function (event, context) {
  try {
    const cookies = cookie.parse(event.headers.cookie || "");
    const token = cookies.uid;

    // jwt.verify(token, process.env.TOKEN_PUBLIC_KEY);

    return {
      statusCode: 200,
      body: {
        message: `We have a token! ${token}`,
      },
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: { message: "token is invalid", error: JSON.stringify(e) },
    };
  }
};
