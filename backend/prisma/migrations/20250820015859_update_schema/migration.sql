-- CreateEnum
CREATE TYPE "public"."TaskPriority" AS ENUM ('Low', 'Medium', 'High');

-- CreateEnum
CREATE TYPE "public"."TaskStatus" AS ENUM ('Open', 'InProgress', 'Completed');

-- CreateEnum
CREATE TYPE "public"."userRole" AS ENUM ('User', 'Admin');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."userRole" NOT NULL DEFAULT 'User',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Task" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "public"."TaskStatus" NOT NULL DEFAULT 'Open',
    "priority" "public"."TaskPriority" NOT NULL DEFAULT 'Low',
    "dueDate" TIMESTAMP(3) NOT NULL,
    "assignedTo" INTEGER,
    "userid" INTEGER,
    "documents" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Task_userid_key" ON "public"."Task"("userid");

-- AddForeignKey
ALTER TABLE "public"."Task" ADD CONSTRAINT "Task_userid_fkey" FOREIGN KEY ("userid") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
