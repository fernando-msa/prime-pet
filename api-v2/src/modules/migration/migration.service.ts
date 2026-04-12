import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { ImportAppointmentsDto, ImportClientsDto, ImportPetsDto } from './dto';

@Injectable()
export class MigrationService {
  constructor(private readonly prisma: PrismaService) {}

  status() {
    return {
      strategy: 'expand-backfill-contract',
      phases: [
        { step: 'expand', status: 'done' },
        { step: 'backfill', status: 'in_progress' },
        { step: 'contract', status: 'pending' },
      ],
    };
  }

  async importClients(payload: ImportClientsDto) {
    const operations = payload.clients.map((client) =>
      this.prisma.client.upsert({
        where: {
          tenantId_externalLegacyId: {
            tenantId: payload.tenantId,
            externalLegacyId: client.legacyId,
          },
        },
        create: {
          tenantId: payload.tenantId,
          externalLegacyId: client.legacyId,
          name: client.name,
          email: client.email,
          phone: client.phone,
        },
        update: {
          name: client.name,
          email: client.email,
          phone: client.phone,
        },
      }),
    );

    await this.prisma.$transaction(operations);
    return { imported: payload.clients.length };
  }

  async importPets(payload: ImportPetsDto) {
    for (const pet of payload.pets) {
      const client = await this.prisma.client.findUnique({
        where: {
          tenantId_externalLegacyId: {
            tenantId: payload.tenantId,
            externalLegacyId: pet.legacyClientId,
          },
        },
      });

      if (!client) {
        throw new NotFoundException(`Cliente legado ${pet.legacyClientId} não encontrado`);
      }

      await this.prisma.pet.upsert({
        where: {
          tenantId_externalLegacyId: {
            tenantId: payload.tenantId,
            externalLegacyId: pet.legacyId,
          },
        },
        create: {
          tenantId: payload.tenantId,
          clientId: client.id,
          externalLegacyId: pet.legacyId,
          name: pet.name,
          species: pet.species,
          breed: pet.breed,
        },
        update: {
          clientId: client.id,
          name: pet.name,
          species: pet.species,
          breed: pet.breed,
        },
      });
    }

    return { imported: payload.pets.length };
  }

  async importAppointments(payload: ImportAppointmentsDto) {
    for (const appointment of payload.appointments) {
      const [client, pet] = await Promise.all([
        this.prisma.client.findUnique({
          where: {
            tenantId_externalLegacyId: {
              tenantId: payload.tenantId,
              externalLegacyId: appointment.legacyClientId,
            },
          },
        }),
        this.prisma.pet.findUnique({
          where: {
            tenantId_externalLegacyId: {
              tenantId: payload.tenantId,
              externalLegacyId: appointment.legacyPetId,
            },
          },
        }),
      ]);

      if (!client || !pet) {
        throw new NotFoundException(`Referências legadas inválidas no agendamento ${appointment.legacyId}`);
      }

      await this.prisma.appointment.upsert({
        where: {
          tenantId_externalLegacyId: {
            tenantId: payload.tenantId,
            externalLegacyId: appointment.legacyId,
          },
        },
        create: {
          tenantId: payload.tenantId,
          externalLegacyId: appointment.legacyId,
          clientId: client.id,
          petId: pet.id,
          startsAt: new Date(appointment.startsAt),
          status: 'scheduled',
          totalAmount: appointment.totalAmount ?? 0,
        },
        update: {
          clientId: client.id,
          petId: pet.id,
          startsAt: new Date(appointment.startsAt),
          totalAmount: appointment.totalAmount ?? 0,
        },
      });
    }

    return { imported: payload.appointments.length };
  }
}
