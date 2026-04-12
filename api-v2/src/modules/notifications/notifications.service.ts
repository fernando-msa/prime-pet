import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  enqueue(tenantId: string, payload: { channel: 'whatsapp' | 'email'; to: string; templateCode: string }) {
    return this.prisma.notificationOutbox.create({
      data: {
        tenantId,
        channel: payload.channel,
        to: payload.to,
        templateCode: payload.templateCode,
        status: 'pending',
      },
    });
  }
}
