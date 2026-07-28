/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Court` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Court` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Court" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Court_name_key" ON "Court"("name");
