import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PetsService {
  constructor(private readonly prisma: PrismaService) {}

  create(tenantId: string, data: { clientId: string; name: string; species: string; breed?: string }) {
    return this.prisma.pet.create({ data: { ...data, tenantId } });
  }

  list(tenantId: string) {
    return this.prisma.pet.findMany({ where: { tenantId }, include: { client: true } });
  }
}
