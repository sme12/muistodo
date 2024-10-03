import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = process.env.SEED_USER_EMAIL ?? "test@test.com";
  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });
  const hashedPassword = await bcrypt.hash(
    process.env.SEED_USER_PASSWORD ?? "P@ssw0rd",
    10,
  );
  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
  await prisma.note.create({
    data: {
      body: "Hello, world!",
      userId: user.id,
      date: new Date(),
    },
  });
  await prisma.note.create({
    data: {
      body: "Hello, world!",
      userId: user.id,
      date: new Date(),
    },
  });
  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
