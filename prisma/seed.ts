import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  // Admin padrão
  const senhaHash = await bcrypt.hash("admin123", 12);
  await prisma.admin.upsert({
    where: { email: "admin@motoshop.com.br" },
    update: {},
    create: { email: "admin@motoshop.com.br", senha: senhaHash, nome: "Administrador" },
  });

  // Configuração padrão
  const existeConfig = await prisma.configuracao.findFirst();
  if (!existeConfig) {
    await prisma.configuracao.create({
      data: {
        taxaJurosNova: 1.49,
        taxaJurosUsada: 1.99,
        entradaMinima: 20,
        whatsappNumero: "5581995473370",
        nomeEmpresa: "Prime Motos",
      },
    });
  }

  // Motos de exemplo
  const motos = [
    {
      marca: "Honda",
      modelo: "CB 500F",
      ano: 2024,
      km: 0,
      preco: 32990,
      destaque: true,
      revisada: true,
      garantia: true,
      procedencia: "Nacional",
      descricao: "Honda CB 500F 2024 0km, completa, com garantia de fábrica. Ideal para uso urbano e viagens. Motor bicilíndrico parallel twin de 471cc.",
    },
    {
      marca: "Yamaha",
      modelo: "MT-07",
      ano: 2023,
      km: 8500,
      preco: 49900,
      destaque: true,
      revisada: true,
      garantia: false,
      procedencia: "Nacional",
      descricao: "Yamaha MT-07 2023 com apenas 8.500km. Moto esportiva nakeed com motor CP2 de 689cc, par torque excepcional e design agressivo.",
    },
    {
      marca: "BMW",
      modelo: "G 310 R",
      ano: 2023,
      km: 3200,
      preco: 28500,
      destaque: false,
      revisada: true,
      garantia: true,
      procedencia: "Importada",
      descricao: "BMW G 310 R 2023, 3.200km. Moto urbana da BMW com motor monocilíndrico de 313cc, ABS e design premium.",
    },
    {
      marca: "Kawasaki",
      modelo: "Z400",
      ano: 2022,
      km: 15000,
      preco: 35000,
      destaque: true,
      revisada: true,
      garantia: false,
      procedencia: "Nacional",
      descricao: "Kawasaki Z400 2022, 15.000km revisados. Motor bicilíndrico de 399cc, ABS, design agressivo Z-style.",
    },
    {
      marca: "Honda",
      modelo: "CG 160 Titan",
      ano: 2024,
      km: 0,
      preco: 13490,
      destaque: false,
      revisada: false,
      garantia: true,
      procedencia: "Nacional",
      descricao: "Honda CG 160 Titan 2024 0km. A moto mais vendida do Brasil, com excelente custo-benefício e economia de combustível.",
    },
    {
      marca: "Yamaha",
      modelo: "Fazer 250",
      ano: 2023,
      km: 22000,
      preco: 18900,
      destaque: false,
      revisada: true,
      garantia: false,
      procedencia: "Nacional",
      descricao: "Yamaha Fazer 250 2023, 22.000km. Sport touring com motor monocilíndrico de 249cc, disco dianteiro e freio a tambor traseiro.",
    },
  ];

  for (const moto of motos) {
    await prisma.moto.create({ data: moto });
  }

  console.log("✅ Seed concluído!");
  console.log("📧 Admin: admin@motoshop.com.br");
  console.log("🔑 Senha: admin123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
