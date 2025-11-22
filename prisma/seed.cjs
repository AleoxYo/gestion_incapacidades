// prisma/seed.cjs
const { PrismaClient, Rol } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  const pass1 = await bcrypt.hash("demo123", 10);
  const pass2 = await bcrypt.hash("demo123", 10);

  await prisma.usuario.upsert({
    where: { email: "analista@example.com" },
    update: {
      // si ya existe, nos aseguramos de que tenga estos datos
      nombre: "Ana Analista",
      password: pass1,
      rol: Rol.ANALISTA,
    },
    create: {
      email: "analista@example.com",
      nombre: "Ana Analista",
      password: pass1,
      rol: Rol.ANALISTA,
    },
  });

  await prisma.usuario.upsert({
    where: { email: "colaborador@example.com" },
    update: {
      nombre: "Carlos Colaborador",
      password: pass2,
      rol: Rol.COLABORADOR,
    },
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

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
