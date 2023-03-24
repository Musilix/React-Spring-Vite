const PrismaDataSource = require("../lib/database/PrismaDataSource");
const prisma = PrismaDataSource.getInstance();
const cookie = require("cookie");
const jwt = require("jsonwebtoken");

// Grab the username from the querystring
// and make surethe current users cookie matches the username
// if not, return an error
exports.handler = async (event, context) => {
  const querystring = event.queryStringParameters.user;

  // grab the users "uid" cookie -if it exists - and then clear said cookie
  //TODO: this is a duplicate of the function in logout.js - abstract out to a util/lib
  const cookieData = cookie.parse(event.headers.cookie || "");
  const token = cookieData.uid;

  if (!token) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: "You're not logged in!",
    };
  }

  // Try to verify the token to make sure that it was valid
  try {
    const { uid } = jwt.verify(token, process.env.TOKEN_PUBLIC_KEY);

    const userToDoUpdate = getCurrUser(uid);

    updateUserCount(userToUpdate, userToDoUpdate);
  } catch (e) {
    return e;
  }
};

async function updateUserCount(userToUpdate, userToDoUpdate) {
  // Quick check to make sure we aren't updating another user's count
  if (userToUpdate === userToDoUpdate) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: "You can't update another user's count!",
    };
  }

  try {
    await prisma.users.update({
      where: {
        username: username,
      },
      data: {
        count: {
          increment: 1,
        },
      },
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: `User's count was updated to ${"xxx"}`,
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: `There was an issue setting the user completed tasks on the server side: ${e}`,
    };
  }
}

// TODO: this is a duplicate of the function in getUser.js
// find a way to generlize these util/lib functions out
async function getCurrUser(uid) {
  try {
    const currUser = await prisma.users.findUnique({
      where: { id: uid },
    });

    return currUser.username;
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
