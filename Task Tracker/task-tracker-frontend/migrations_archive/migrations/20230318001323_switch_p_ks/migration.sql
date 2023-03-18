/*
  Warnings:

  - The primary key for the `Users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_new` on the `Users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Users" DROP CONSTRAINT "Users_pkey";
ALTER TABLE "Users" DROP COLUMN "id";
ALTER TABLE "Users" RENAME COLUMN "id_new" TO "id";

ALTER TABLE "Users" ADD CONSTRAINT "Users_pkey" PRIMARY KEY ("id");
-- DROP SEQUENCE "Users_id_seq";
