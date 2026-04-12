import { Body, Controller, Get, Post, Query, Req, UseGuards, UseInterceptors } from '@nestjs/common';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantInterceptor } from '../../common/interceptors/tenant.interceptor';
import { MedicalRecordsService } from './medical-records.service';

@Controller('medical-records')
@UseGuards(JwtAuthGuard)
@UseInterceptors(TenantInterceptor)
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

  @Get()
  list(@Req() req: { tenantId: string }, @Query('petId') petId?: string) {
    return this.medicalRecordsService.list(req.tenantId, petId);
  }

  @Post()
  create(@Req() req: { tenantId: string }, @Body() body: { petId: string; notes: string; diagnosis?: string }) {
    return this.medicalRecordsService.create(req.tenantId, body);
  }
}
