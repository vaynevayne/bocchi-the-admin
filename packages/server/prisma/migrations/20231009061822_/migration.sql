-- AlterTable
CREATE SEQUENCE user_accountid_seq;
ALTER TABLE "User" ALTER COLUMN "accountId" SET DEFAULT nextval('user_accountid_seq');
ALTER SEQUENCE user_accountid_seq OWNED BY "User"."accountId";

-- CreateTable
CREATE TABLE "LoginLog" (
    "id" SERIAL NOT NULL,
    "accountId" INTEGER NOT NULL,
    "ip" TEXT NOT NULL,
    "address" TEXT,
    "browser" TEXT,
    "os" TEXT,
    "status" BOOLEAN,
    "message" TEXT,
    "username" TEXT NOT NULL,

    CONSTRAINT "LoginLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LoginLog" ADD CONSTRAINT "LoginLog_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
