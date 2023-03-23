const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();
const cookie = require("cookie");

exports.handler = async (event, context) => {
  try {
    let isAuth = false;
    const token = getUserToken(event);
    const username = event.queryStringParameters.user || null;
    // const cookieData = token
    //   ? jwt.verify(token, process.env.TOKEN_PUBLIC_KEY, (err, decoder) => {
    //       if (err) {
    //         return null;
    //       }

    //       return decoder;
    //     })
    //   : null;

    // user currently has a valid JWT
    // isAuth = cookieData ? true : false;

    // let userDetails = null;
    // if (isAuth) {
    //   userDetails = await getUserFromDB(username);
    // } else {
    //   return {
    //     statusCode: 401,
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       message: "You're not authorized to access this.",
    //     }),
    //   };
    // }
    const userDetails = await getUserFromDB(username);
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: `There was an issue on the server side: ${e}`,
    };
  }
};

function getUserToken(event) {
  const cookies = cookie.parse(event.headers.cookie || "");
  const token = cookies.uid;

  return token;
}

async function getUserFromDB(username) {
  try {
    let userDetails;
    if (username.length) {
      userDetails = await prisma.users.findFirst({
        where: { username: username },
      });
      return userDetails;
    }
  } catch (e) {
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "The DB is probably dead...",
      }),
    };
  }
}
