const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.handler = async (event, context, callback) => {
  const user = await prisma.users.findFirst({
    where: { username: "keemkeem" },
  });
  const userTotalApplied = user.count;

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: `The current count for user ${user.username} is [${userTotalApplied}]`,
  };
};
