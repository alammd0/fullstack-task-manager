import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

export async function resetDb() {
  const deleted = await prisma.$transaction([
    prisma.task.deleteMany({}),
    prisma.user.deleteMany({})
  ]);
  console.log(`DB Reset -> users: ${deleted[1].count}, tasks: ${deleted[0].count}`);
}

export async function closeDb() {
  await prisma.$disconnect();
}
