const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const { __prod__ } = require("../src/constants");

exports.handler = async function (event, context) {
  try {
    // Trick to check whether a uid cookie is already set up for the user in the browser...
    // Weird stuff happens when there is no cookie though and you're trying to login fresh, as event.headers.cookie will be undefined.
    // So we add an empty string fallback
    const cookieMap = cookie.parse(event.headers.cookie || "");

    // Intial check - if they somehow called the login endpoint while currently logged in, we send them back with nothing
    if ("uid" in cookieMap) {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: "You're somehow already logged in" }),
      };
    }

    const User = await getUser(event.body);
    const tokenSecret = process.env.TOKEN_PRIVATE_KEY;
    const token = jwt.sign({ uid: User.id }, tokenSecret, {
      algorithm: "RS256",
      expiresIn: "1h",
    });

    const userCookie = cookie.serialize("uid", token, {
      domain: process.env.DOMAIN,
      path: "/",
      httpOnly: true,
      secure: __prod__,
      maxAge: 60 * 60,
      sameSite: "lax",
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": userCookie,
      },
      body: JSON.stringify(User),
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "There was an error on the server when logging in.",
      }),
    };
  }
};

async function getUser(body) {
  const data = JSON.parse(body);
  const userDetails = await prisma.users.findFirst({
    where: { username: data.username },
  });

  return userDetails;
}
