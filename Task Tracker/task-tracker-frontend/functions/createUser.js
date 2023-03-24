const { Prisma } = require("@prisma/client");
const PrismaDataSource = require("../lib/database/PrismaDataSource");
const prisma = PrismaDataSource.getInstance();
const cookie = require("cookie");
const { __cookieOptions__, __tokenOptions__ } = require("../src/constants");

const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.handler = async (event, context, callback) => {
  try {
    const createdUser = await createUserInDB(event);
    const myCookie = createUserToken(createdUser);

    // return user info back to client req, with new JWT included in cookie named 'uid'
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
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};

async function createUserInDB({ body }) {
  const data = JSON.parse(body);
  const createdUser = await prisma.users.create({
    data: { count: 0, username: data.username, currentGoal: 5 },
  });

  return createdUser;
}

function createUserToken(createdUser) {
  // Create token with user information
  const tokenSecret = process.env.TOKEN_PRIVATE_KEY;
  const token = jwt.sign(
    { uid: createdUser.id },
    tokenSecret,
    __tokenOptions__
  );

  const myCookie = cookie.serialize("uid", token, __cookieOptions__);

  return myCookie;
}
