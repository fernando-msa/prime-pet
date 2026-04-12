import { Body, Controller, Get, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantInterceptor } from '../../common/interceptors/tenant.interceptor';
import { ClientsService } from './clients.service';

@Controller('clients')
@UseGuards(JwtAuthGuard)
@UseInterceptors(TenantInterceptor)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  list(@Req() req: { tenantId: string }) {
    return this.clientsService.list(req.tenantId);
  }

  @Post()
  create(@Req() req: { tenantId: string }, @Body() body: { name: string; email?: string; phone?: string }) {
    return this.clientsService.create(req.tenantId, body);
  }
}
