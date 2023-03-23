const cookie = require("cookie");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.handler = async (event, context) => {
  const cookies = cookie.parse(event.headers.cookie);
  const token = cookies.uid;

  if ("uid" in cookies) {
    const user = returnCurrentUser(token);

    return user;
  }

  return null;
};

async function returnCurrentUser(id) {
  const user = await prisma.users.findFirst({ where: { id: id } });
  return user;
}
