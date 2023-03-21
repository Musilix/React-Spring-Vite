const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();
const cookie = require("cookie");
const { __prod__ } = require("../src/constants");

const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.handler = async (event, context, callback) => {
  try {
    const createdUser = await createUserInDB(event);

    // Create token with user information
    const tokenSecret = process.env.TOKEN_PRIVATE_KEY;
    const token = jwt.sign({ uid: createdUser.id }, tokenSecret, {
      algorithm: "RS256",
      expiresIn: "1m",
    });

    console.log(__prod__);
    const myCookie = cookie.serialize("uid", token, {
      secure: __prod__,
      httpOnly: true,
      path: "/",
      domain: process.env.DOMAIN,
      maxAge: 60, // one minute
      sameSite: "lax",
    });
    // return user info back to client req, with new bearer token included
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": myCookie,
      },
      body: JSON.stringify(createdUser),
    };
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return {
          statusCode: 409,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            error: "A user with this username already exists",
          }),
        };
      }
    }
    console.error(e);
    return { statusCode: 500, body: JSON.stringify(e) };
  }
};

async function createUserInDB({ body }) {
  const data = JSON.parse(body);
  const createdUser = await prisma.users.create({
    data: { count: 0, username: data.username, currentGoal: 5 },
  });

  return createdUser;
}
