import { Body, Controller, Get, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantInterceptor } from '../../common/interceptors/tenant.interceptor';
import { AppointmentsService } from './appointments.service';

@Controller('appointments')
@UseGuards(JwtAuthGuard)
@UseInterceptors(TenantInterceptor)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  list(@Req() req: { tenantId: string }) {
    return this.appointmentsService.list(req.tenantId);
  }

  @Post()
  create(
    @Req() req: { tenantId: string },
    @Body() body: { clientId: string; petId: string; startsAt: string; totalAmount?: number },
  ) {
    return this.appointmentsService.create(req.tenantId, body);
  }
}
