import { PrismaClient } from "@prisma/client";
import { __prod__ } from "../src/constants";

interface CustomNodeJSGlobal {
  prisma: PrismaClient;
}

declare const global: CustomNodeJSGlobal;

const prisma = global.prisma || new PrismaClient();
if (!__prod__) global.prisma = prisma;
