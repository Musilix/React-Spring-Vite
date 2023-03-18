const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.handler = async (event, context) => {
  const querystring = event.queryStringParameters;
  const taskGoal = querystring.taskGoal;

  try {
    await prisma.users.update({
      where: { username: "keemkeem" },
      data: { currentGoal: Number(taskGoal) },
    });
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: `User's task goal amt was updated to ${taskGoal}`,
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: `There was an issue setting the user completed tasks on the server side: ${e}`,
    };
  }
};
