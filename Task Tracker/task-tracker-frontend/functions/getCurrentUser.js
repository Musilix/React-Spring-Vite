// netlify function that grabs a user's cookie from the event headers and verifys it using the jsonwebtoken package
// then use the uid from the cookie to retrieve tthe user's data from the database using prisma
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const PrismaDataSource = require("../lib/database/PrismaDataSource");
const prisma = PrismaDataSource.getInstance();

exports.handler = async function (event, context) {
  const cookies = cookie.parse(event.headers.cookie || "");
  const token = cookies.uid;

  if (!token) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: null,
    };
  }

  try {
    const cookieData = jwt.verify(token, process.env.TOKEN_PUBLIC_KEY);
    const { uid } = cookieData;

    const currentUser = await getUserData(uid);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(currentUser),
    };
  } catch (e) {
    return { statusCode: 401, body: "Unauthorized" };
  }
};

async function getUserData(uid) {
  // use prisma to retrieve user data from the database
  try {
    const currentUser = await prisma.users.findUnique({ where: { id: uid } });
    return currentUser;
  } catch (e) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: e.message }),
    };
  }
}
