const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.handler = async (event, context) => {
  try {
    await prisma.users.update({
      where: {
        id: 2,
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
      body: `There was an issue setting the user completed tasks on the server side: ${e}`,
    };
  }
};
