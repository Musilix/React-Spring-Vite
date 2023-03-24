const PrismaDataSource = require("../lib/database/PrismaDataSource");
const prisma = PrismaDataSource.getInstance();

exports.handler = async (event, context) => {
  try {
    const userToSearch = event.queryStringParameters.user;
    const user = await getUserData(userToSearch);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: `There was an issue setting the user completed tasks on the server side: ${e}`,
    };
  }
};

async function getUserData(username) {
  try {
    const userToSearch = await prisma.users.findUnique({
      where: { username: username },
    });

    return userToSearch;
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message }),
    };
  }
}
