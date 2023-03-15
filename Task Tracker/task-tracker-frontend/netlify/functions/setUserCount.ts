import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function handler() {
  try {
    const user = await prisma.users.update({
      where: {
        id: 2,
      },
      data: {
        count: {
          increment: 1,
        },
      },
    });
  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify(e),
    };
  }
}
