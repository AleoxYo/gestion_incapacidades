import { PrismaClient, Rol } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const pass1 = await bcrypt.hash("demo123", 10);
  const pass2 = await bcrypt.hash("demo123", 10);

  await prisma.usuario.upsert({
    where: { email: "analista@example.com" },
    update: {},
    create: {
      email: "analista@example.com",
      nombre: "Ana Analista",
      password: pass1,
      rol: Rol.ANALISTA,
    },
  });

  await prisma.usuario.upsert({
    where: { email: "colaborador@example.com" },
    update: {},
    create: {
      email: "colaborador@example.com",
      nombre: "Carlos Colaborador",
      password: pass2,
      rol: Rol.COLABORADOR,
    },
  });

  console.log(
    "Seed listo: analista@example.com / demo123 | colaborador@example.com / demo123"
  );
}

main().finally(() => prisma.$disconnect());
