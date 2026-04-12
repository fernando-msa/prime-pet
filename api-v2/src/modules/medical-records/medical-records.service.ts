import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MedicalRecordsService {
  constructor(private readonly prisma: PrismaService) {}

  create(tenantId: string, data: { petId: string; notes: string; diagnosis?: string }) {
    return this.prisma.medicalRecord.create({ data: { ...data, tenantId } });
  }

  list(tenantId: string, petId?: string) {
    return this.prisma.medicalRecord.findMany({
      where: { tenantId, ...(petId ? { petId } : {}) },
      orderBy: { createdAt: 'desc' },
    });
  }
}
