-- AlterTable
ALTER TABLE "User" ALTER COLUMN "deleteAt" DROP NOT NULL,
ALTER COLUMN "version" SET DEFAULT 1;