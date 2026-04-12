/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

function loadJson(filePath) {
  const absolute = path.resolve(process.cwd(), filePath);
  return JSON.parse(fs.readFileSync(absolute, 'utf8'));
}

async function ensureTenant(config) {
  const existing = await prisma.tenant.findUnique({ where: { slug: config.tenant.slug } });
  if (existing) return existing;

  return prisma.tenant.create({
    data: {
      id: config.tenant.id,
      name: config.tenant.name,
      slug: config.tenant.slug,
      planCode: config.tenant.planCode || 'starter',
      maxUsers: config.tenant.maxUsers || 3,
      maxAppointmentsMonth: config.tenant.maxAppointmentsMonth || 150,
    },
  });
}

async function backfillClients(tenantId, clients, dryRun) {
  if (dryRun) return { clients: clients.length };

  const ops = clients.map((client) =>
    prisma.client.upsert({
      where: {
        tenantId_externalLegacyId: {
          tenantId,
          externalLegacyId: String(client.legacyId),
        },
      },
      create: {
        tenantId,
        externalLegacyId: String(client.legacyId),
        name: client.name,
        email: client.email || null,
        phone: client.phone || null,
      },
      update: {
        name: client.name,
        email: client.email || null,
        phone: client.phone || null,
      },
    }),
  );

  await prisma.$transaction(ops);
  return { clients: clients.length };
}

async function backfillPets(tenantId, pets, dryRun) {
  let imported = 0;

  for (const pet of pets) {
    const client = await prisma.client.findUnique({
      where: {
        tenantId_externalLegacyId: {
          tenantId,
          externalLegacyId: String(pet.legacyClientId),
        },
      },
    });

    if (!client) {
      console.warn(`[skip] client not found for pet legacyId=${pet.legacyId}`);
      continue;
    }

    imported += 1;
    if (dryRun) continue;

    await prisma.pet.upsert({
      where: {
        tenantId_externalLegacyId: {
          tenantId,
          externalLegacyId: String(pet.legacyId),
        },
      },
      create: {
        tenantId,
        clientId: client.id,
        externalLegacyId: String(pet.legacyId),
        name: pet.name,
        species: pet.species,
        breed: pet.breed || null,
      },
      update: {
        clientId: client.id,
        name: pet.name,
        species: pet.species,
        breed: pet.breed || null,
      },
    });
  }

  return { pets: imported };
}

async function backfillAppointments(tenantId, appointments, dryRun) {
  let imported = 0;

  for (const item of appointments) {
    const [client, pet] = await Promise.all([
      prisma.client.findUnique({
        where: {
          tenantId_externalLegacyId: {
            tenantId,
            externalLegacyId: String(item.legacyClientId),
          },
        },
      }),
      prisma.pet.findUnique({
        where: {
          tenantId_externalLegacyId: {
            tenantId,
            externalLegacyId: String(item.legacyPetId),
          },
        },
      }),
    ]);

    if (!client || !pet) {
      console.warn(`[skip] appointment ${item.legacyId} missing refs`);
      continue;
    }

    imported += 1;
    if (dryRun) continue;

    await prisma.appointment.upsert({
      where: {
        tenantId_externalLegacyId: {
          tenantId,
          externalLegacyId: String(item.legacyId),
        },
      },
      create: {
        tenantId,
        externalLegacyId: String(item.legacyId),
        clientId: client.id,
        petId: pet.id,
        startsAt: new Date(item.startsAt),
        status: item.status || 'scheduled',
        totalAmount: item.totalAmount || 0,
      },
      update: {
        clientId: client.id,
        petId: pet.id,
        startsAt: new Date(item.startsAt),
        status: item.status || 'scheduled',
        totalAmount: item.totalAmount || 0,
      },
    });
  }

  return { appointments: imported };
}

async function main() {
  const configPath = process.argv[2] || 'scripts/backfill-config.example.json';
  const dryRun = process.argv.includes('--dry-run');
  const config = loadJson(configPath);

  const tenant = await ensureTenant(config);

  const clients = loadJson(config.sources.clients);
  const pets = loadJson(config.sources.pets);
  const appointments = loadJson(config.sources.appointments);

  const c = await backfillClients(tenant.id, clients, dryRun);
  const p = await backfillPets(tenant.id, pets, dryRun);
  const a = await backfillAppointments(tenant.id, appointments, dryRun);

  console.log({ dryRun, tenantId: tenant.id, ...c, ...p, ...a });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
