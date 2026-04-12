import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  create(tenantId: string, data: { name: string; email?: string; phone?: string }) {
    return this.prisma.client.create({ data: { ...data, tenantId } });
  }

  list(tenantId: string) {
    return this.prisma.client.findMany({ where: { tenantId }, orderBy: { createdAt: 'desc' } });
  }
}
