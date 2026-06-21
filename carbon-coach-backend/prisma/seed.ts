import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // 1. Seed Challenges
  const challenges = [
    {
      title: "No Car Week",
      description: "Commute using public transport, walking, or cycling for 7 days.",
      points: 350,
      daysTotal: 7,
      category: "transport",
      active: true,
    },
    {
      title: "Plant-Based Week",
      description: "Eat purely vegan or vegetarian meals for 7 days straight.",
      points: 400,
      daysTotal: 7,
      category: "food",
      active: true,
    },
    {
      title: "Energy Saver Challenge",
      description: "Turn off AC and unplug idle devices daily for 5 days.",
      points: 250,
      daysTotal: 5,
      category: "energy",
      active: true,
    },
    {
      title: "Plastic-Free Week",
      description: "Avoid single-use plastics and carry your own reusable items for 7 days.",
      points: 300,
      daysTotal: 7,
      category: "waste",
      active: true,
    },
  ];

  for (const ch of challenges) {
    await prisma.challenge.upsert({
      where: { id: ch.title }, // using title as temporary lookup identifier or matching on title
      update: {},
      create: ch,
    }).catch(() => {
      // In case title constraint isn't unique in prisma (it is uuid id, so we just create them)
      return prisma.challenge.create({ data: ch });
    });
  }

  // 2. Seed Rewards
  const rewards = [
    {
      title: "Plant a Tree",
      description: "We partner with One Tree Planted to plant a native tree on your behalf.",
      pointsRequired: 500,
      impactGenerated: "Saves ~22 kg CO₂/year",
      category: "nature",
      active: true,
    },
    {
      title: "Donate to Ocean Cleanups",
      description: "Remove 1 kg of plastic trash from oceans and coastal waterways.",
      pointsRequired: 400,
      impactGenerated: "Reduces plastic pollution & marine eco-damage",
      category: "cleanup",
      active: true,
    },
    {
      title: "Bamboo Coffee Mug",
      description: "Get a 100% biodegradable bamboo coffee travel tumbler.",
      pointsRequired: 800,
      impactGenerated: "Saves ~150 single-use cups/year",
      category: "product",
      active: true,
    },
    {
      title: "$10 Sustainable Fashion Coupon",
      description: "Discount code for verified organic cotton clothing brands.",
      pointsRequired: 300,
      impactGenerated: "Supports eco-friendly clothing production",
      category: "coupon",
      active: true,
    },
  ];

  for (const r of rewards) {
    await prisma.reward.create({ data: r }).catch(() => {});
  }

  console.log("✅ Seeding complete. Upserted initial Challenges and Rewards!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
