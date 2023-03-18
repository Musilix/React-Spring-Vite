const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.handler = async (event, context) => {
  try {
    const user = await prisma.users.findFirst({
      where: { username: "keemkeem" },
    });

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
