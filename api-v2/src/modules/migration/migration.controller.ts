import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';

import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { ImportAppointmentsDto, ImportClientsDto, ImportPetsDto } from './dto';
import { MigrationService } from './migration.service';

@Controller('migration')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class MigrationController {
  constructor(private readonly migrationService: MigrationService) {}

  @Get('status')
  status() {
    return this.migrationService.status();
  }

  @Get('progress')
  progress(@Query('tenantId') tenantId: string) {
    return this.migrationService.progress(tenantId);
  }

  @Get('overall-status')
  overallStatus(@Query('tenantId') tenantId: string) {
    return this.migrationService.overallStatus(tenantId);
  }

  @Post('import/clients')
  importClients(@Body() body: ImportClientsDto) {
    return this.migrationService.importClients(body);
  }

  @Post('import/pets')
  importPets(@Body() body: ImportPetsDto) {
    return this.migrationService.importPets(body);
  }

  @Post('import/appointments')
  importAppointments(@Body() body: ImportAppointmentsDto) {
    return this.migrationService.importAppointments(body);
  }
}
