-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('VERIFY_EMAIL', 'RESET_PASSWORD');

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "recurringGroupId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "type" "TokenType" NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
