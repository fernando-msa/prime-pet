import { Controller, Get, Req, UseGuards, UseInterceptors } from '@nestjs/common';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantInterceptor } from '../../common/interceptors/tenant.interceptor';
import { PlansService } from './plans.service';

@Controller('plans')
@UseGuards(JwtAuthGuard)
@UseInterceptors(TenantInterceptor)
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Get('catalog')
  catalog() {
    return this.plansService.listCatalog();
  }

  @Get('limits')
  limits(@Req() req: { tenantId: string }) {
    return this.plansService.limitsByTenant(req.tenantId);
  }
}
