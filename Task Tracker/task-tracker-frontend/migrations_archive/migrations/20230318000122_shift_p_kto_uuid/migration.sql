-- AlterTable
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
ALTER TABLE "Users" ADD COLUMN     "id_new" TEXT NOT NULL DEFAULT public.uuid_generate_v4();
