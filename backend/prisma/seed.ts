import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";
import bcrypt from "bcryptjs";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash("Admin@123", salt);

  const admin = await prisma.user.upsert({
    where: { email: "admin@ctbicas.com" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@ctbicas.com",
      password: hashedPassword,
      role: "ADMIN",
      isVerified: true,
    },
  });

  console.log(`✅ Admin seed pronto: ${admin.email}`);
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
