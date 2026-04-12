import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async summary(tenantId: string) {
    const [appointments, revenue] = await Promise.all([
      this.prisma.appointment.count({ where: { tenantId } }),
      this.prisma.appointment.aggregate({
        where: { tenantId, status: 'completed' },
        _sum: { totalAmount: true },
      }),
    ]);

    return {
      appointments,
      revenue: revenue._sum.totalAmount ?? 0,
    };
  }
}
