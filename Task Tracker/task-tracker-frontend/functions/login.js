// netlify function that will take a users request body and use the username to login and generate a cookie
const jwt = require("jsonwebtoken");
const cookie = require("cookie");
const PrismaDataSource = require("../lib/database/PrismaDataSource");
const prisma = PrismaDataSource.getInstance();
const { __cookieOptions__, __tokenOptions__ } = require("../src/constants");

exports.handler = async (event, context) => {
  // need to make sure the user isn't already logged in while trying to log in to an acc
  // a valid cookie will be present if the user is already logged in
  const userLoggedIn = checkIfUserIsLoggedIn(event);

  if (userLoggedIn) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: "You're already logged in!",
    };
  }

  // Otherwise, the user is not logged in and we can proceed with the login process
  const { username } = JSON.parse(event.body);
  const user = await getUserData(username);

  if (!user) {
    return {
      statusCode: 404,
      body: "No user found with that username",
    };
  }

  const userCookie = createUserToken(user);

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": userCookie,
    },
    body: JSON.stringify(user),
  };
};

async function getUserData(username) {
  try {
    const user = await prisma.users.findUnique({
      where: { username: username },
    });

    return user;
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    };
  }
}

function createUserToken(user) {
  const token = jwt.sign(
    { uid: user.id },
    process.env.TOKEN_PRIVATE_KEY,
    __tokenOptions__
  );

  // FUTURE NOTE: this johns  is ridiculous.
  // for some reason, the cookie.serialize function doesn't like the __cookieOptions__ object unless I spread it
  const cookieData = cookie.serialize("uid", token, {
    ...__cookieOptions__,
  });

  return cookieData;
}

function checkIfUserIsLoggedIn(event) {
  const cookies = cookie.parse(event.headers.cookie || "");
  const token = cookies.uid;

  if (!token) {
    return false;
  }

  // Try to verify the token to make sure that it was valid
  try {
    const { uid } = jwt.verify(token, process.env.TOKEN_PUBLIC_KEY);
    if (uid) {
      return true;
    }
  } catch (e) {
    return e;
  }

  return false;
}
