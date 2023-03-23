const { __prod__ } = require("../src/constants");
const cookie = require("cookie");

exports.handler = async function (events, context) {
  // clear the authentication cookie
  const cookieHeader = cookie.serialize("uid", "", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: __prod__,
    domain: process.env.DOMAIN,
    maxAge: 0,
  });

  // return response with cleared cookie header
  return {
    statusCode: 200,
    headers: {
      "Set-Cookie": cookieHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: "Logged out successfully" }),
  };
};
