-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "id_new" SET DEFAULT public.uuid_generate_v4();
