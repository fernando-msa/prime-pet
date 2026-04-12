import { Controller, Get, Param, Req, UseGuards, UseInterceptors } from '@nestjs/common';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { TenantInterceptor } from '../../common/interceptors/tenant.interceptor';
import { AuditService } from './audit.service';

@Controller('audit')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(TenantInterceptor)
@Roles('admin')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get(':entityType/:entityId')
  listByEntity(@Req() req: { tenantId: string }, @Param('entityType') entityType: string, @Param('entityId') entityId: string) {
    return this.auditService.listByEntity(req.tenantId, entityType, entityId);
  }
}
