/*
  Warnings:

  - Added the required column `dueDate` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Made the column `userid` on table `Task` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Task" DROP CONSTRAINT "Task_userid_fkey";

-- DropIndex
DROP INDEX "public"."Task_userid_key";

-- AlterTable
ALTER TABLE "public"."Task" ADD COLUMN     "dueDate" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "userid" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Task" ADD CONSTRAINT "Task_userid_fkey" FOREIGN KEY ("userid") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
