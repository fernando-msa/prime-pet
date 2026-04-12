import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PlansService {
  constructor(private readonly prisma: PrismaService) {}

  listCatalog() {
    return this.prisma.plan.findMany({ orderBy: { monthlyPrice: 'asc' } });
  }

  limitsByTenant(tenantId: string) {
    return this.prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { id: true, name: true, planCode: true, maxUsers: true, maxAppointmentsMonth: true },
    });
  }
}
