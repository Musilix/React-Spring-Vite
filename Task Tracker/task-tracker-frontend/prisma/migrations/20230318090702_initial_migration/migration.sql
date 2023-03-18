-- CreateTable
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE "Users" (
    "username" VARCHAR(255) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "currentGoal" INTEGER NOT NULL DEFAULT 0,
    "id" TEXT NOT NULL DEFAULT uuid_generate_v4(),

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");
