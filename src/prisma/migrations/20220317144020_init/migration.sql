/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `ContactUser` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ContactUser_email_key" ON "ContactUser"("email");
