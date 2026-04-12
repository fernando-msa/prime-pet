import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  create(tenantId: string, data: { clientId: string; petId: string; startsAt: string; totalAmount?: number }) {
    return this.prisma.appointment.create({
      data: {
        tenantId,
        clientId: data.clientId,
        petId: data.petId,
        startsAt: new Date(data.startsAt),
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
