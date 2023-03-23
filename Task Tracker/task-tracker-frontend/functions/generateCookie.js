const cookie = require("cookie");
const { __prod__ } = require("../src/constants");

const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.handler = async (event, context, callback) => {
  try {
    const userPlaceHolder = {
      id: "42f28743-bbb6-4cd2-a989-7f85e001a7a8",
      username: "jonjon",
      count: 0,
      currentGoal: 5,
    };

    // Create token with user information
    const tokenSecret = process.env.TOKEN_PRIVATE_KEY;
    const token = jwt.sign({ uid: userPlaceHolder.id }, tokenSecret, {
      algorithm: "RS256",
      expiresIn: "1h",
    });

    const myCookie = cookie.serialize("uid", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24, // one minute
      sameSite: "lax",
      secure: __prod__,
      domain: process.env.DOMAIN,
    });

    // return user info back to client req, with new bearer token included
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": myCookie,
      },
      body: JSON.stringify(userPlaceHolder),
    };
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: JSON.stringify(e) };
  }
};
