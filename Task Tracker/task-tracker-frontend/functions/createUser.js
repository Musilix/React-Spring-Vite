const { PrismaClient, Prisma } = require("@prisma/client");
const prisma = new PrismaClient();

const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.handler = async (event, context, callback) => {
  try {
    const createdUser = await createUserInDB(event);

    // Create token with user information
    const tokenSecret = process.env.TOKEN_SALT;
    const token = jwt.sign({ uid: user.id }, tokenSecret, {
      algorithm: "RS256",
      expiresIn: "1m",
    });

    // return user info back to client req, with new bearer token included
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
