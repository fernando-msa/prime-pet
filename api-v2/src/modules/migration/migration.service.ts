import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

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

  async progress(tenantId: string) {
    if (!tenantId) {
      throw new BadRequestException('tenantId é obrigatório');
    }
    const [
      totalClients,
      migratedClients,
      totalPets,
      migratedPets,
      totalAppointments,
      migratedAppointments,
      totalMedicalRecords,
      outboxPending,
      auditEntries,
    ] = await Promise.all([
      this.prisma.client.count({ where: { tenantId } }),
      this.prisma.client.count({ where: { tenantId, externalLegacyId: { not: null } } }),
      this.prisma.pet.count({ where: { tenantId } }),
      this.prisma.pet.count({ where: { tenantId, externalLegacyId: { not: null } } }),
      this.prisma.appointment.count({ where: { tenantId } }),
      this.prisma.appointment.count({ where: { tenantId, externalLegacyId: { not: null } } }),
      this.prisma.medicalRecord.count({ where: { tenantId } }),
      this.prisma.notificationOutbox.count({ where: { tenantId, status: 'pending' } }),
      this.prisma.auditLog.count({ where: { tenantId } }),
    ]);

    const coverage = {
      clients: totalClients === 0 ? 0 : Number(((migratedClients / totalClients) * 100).toFixed(1)),
      pets: totalPets === 0 ? 0 : Number(((migratedPets / totalPets) * 100).toFixed(1)),
      appointments:
        totalAppointments === 0 ? 0 : Number(((migratedAppointments / totalAppointments) * 100).toFixed(1)),
    };

    const domainCoverage = Number(((coverage.clients + coverage.pets + coverage.appointments) / 3).toFixed(1));

    return {
      tenantId,
      stage: domainCoverage >= 95 ? 'ready_for_contract' : 'backfill_in_progress',
      domainCoverage,
      coverage,
      operationalReadiness: {
        authJwtRefresh: true,
        rbac: true,
        dashboardMetrics: true,
        notificationsOutboxReady: true,
        pendingNotifications: outboxPending,
        auditEntries,
      },
      layoutReadiness: {
        apiStableForNewLayout: domainCoverage >= 70,
        recommendedNextScreens: [
          'Clientes (listagem + cadastro)',
          'Pets (vinculado a cliente)',
          'Agendamentos (filtro por status/data)',
          'Dashboard (atendimentos + faturamento)',
        ],
      },
      remainingWork: {
        backfill: domainCoverage >= 95 ? 'finalizar validação amostral' : 'continuar importação por lote',
        contractPhase: domainCoverage >= 95 ? 'habilitar tenant_id NOT NULL + FKs legadas' : 'aguardar cobertura >= 95%',
        layout: 'migrar frontend para consumir /api/v2 com x-tenant-id e JWT',
      },
      counters: {
        totalClients,
        migratedClients,
        totalPets,
        migratedPets,
        totalAppointments,
        migratedAppointments,
        totalMedicalRecords,
      },
    };
  }


  async overallStatus(tenantId: string) {
    const progress = await this.progress(tenantId);
    const dataCoverage = progress.domainCoverage;

    const tracks = {
      apiV2Foundation: 100,
      visualRefactor: 100,
      dataBackfill: dataCoverage,
      frontendCutover: dataCoverage >= 70 ? 60 : 25,
      contractPhase: dataCoverage >= 95 ? 20 : 0,
    };

    const overall = Number(
      (
        tracks.apiV2Foundation * 0.2 +
        tracks.visualRefactor * 0.2 +
        tracks.dataBackfill * 0.3 +
        tracks.frontendCutover * 0.2 +
        tracks.contractPhase * 0.1
      ).toFixed(1),
    );

    const remaining = Number((100 - overall).toFixed(1));

    return {
      tenantId,
      overall,
      remaining,
      tracks,
      recommendation:
        dataCoverage >= 70
          ? 'Iniciar virada gradual dos fluxos para /api/v2 por feature flag.'
          : 'Priorizar backfill até atingir pelo menos 70% de cobertura de dados.',
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
