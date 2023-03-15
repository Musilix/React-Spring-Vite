import { PrismaClient } from "@prisma/client";
const prisma: PrismaClient = new PrismaClient();

export async function handler() {
  try {
    // hard code finding ME... i'm the only one in this db, im the only one i care about right now...
    const user = await prisma.users.findFirst({
      where: {
        id: 2,
      },
    });

    const userTotalTaskCount = user?.count;

    console.log(`You've completed ${userTotalTaskCount} job applications`);
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify(e),
    };
  }
}
