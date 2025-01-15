/*
  Warnings:

  - Added the required column `routeName` to the `BusRoute` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BusRoute" ADD COLUMN     "description" TEXT,
ADD COLUMN     "routeName" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");
