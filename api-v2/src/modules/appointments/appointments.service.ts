import { ForbiddenException, Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(tenantId: string, data: { clientId: string; petId: string; startsAt: string; totalAmount?: number }) {
    const appointmentDate = new Date(data.startsAt);
    const startMonth = new Date(Date.UTC(appointmentDate.getUTCFullYear(), appointmentDate.getUTCMonth(), 1));
    const endMonth = new Date(Date.UTC(appointmentDate.getUTCFullYear(), appointmentDate.getUTCMonth() + 1, 1));

    const [tenant, usedAppointments] = await Promise.all([
      this.prisma.tenant.findUnique({ where: { id: tenantId }, select: { maxAppointmentsMonth: true } }),
      this.prisma.appointment.count({
        where: {
          tenantId,
          startsAt: {
            gte: startMonth,
            lt: endMonth,
          },
        },
      }),
    ]);

    if (tenant && usedAppointments >= tenant.maxAppointmentsMonth) {
      throw new ForbiddenException('Limite mensal de agendamentos do plano atingido');
    }

    return this.prisma.appointment.create({
      data: {
        tenantId,
        clientId: data.clientId,
        petId: data.petId,
        startsAt: appointmentDate,
        totalAmount: data.totalAmount ?? 0,
        status: 'scheduled',
      },
    });
  }

  list(tenantId: string) {
    return this.prisma.appointment.findMany({
      where: { tenantId },
      include: { client: true, pet: true },
      orderBy: { startsAt: 'desc' },
    });
  }
}
