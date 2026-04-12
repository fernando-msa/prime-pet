import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TenantsService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: { name: string; slug: string; planCode?: string }) {
    return this.prisma.tenant.create({
      data: {
        name: data.name,
        slug: data.slug,
        planCode: data.planCode ?? 'starter',
      },
    });
  }
}
