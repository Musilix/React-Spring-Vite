const PrismaDataSource = require("../lib/database/PrismaDataSource");

const prisma = new PrismaDataSource.getInstance().prisma;

exports.handler = async (event, context, callback) => {
  const user = await prisma.users.findUnique({
    where: { username: "keemkeem" },
  });
  const userTotalApplied = user.count;

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: `The current count for user ${user.username} is [${userTotalApplied}]`,
  };
};
