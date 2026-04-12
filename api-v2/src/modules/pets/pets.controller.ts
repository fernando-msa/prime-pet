import { Body, Controller, Get, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantInterceptor } from '../../common/interceptors/tenant.interceptor';
import { PetsService } from './pets.service';

@Controller('pets')
@UseGuards(JwtAuthGuard)
@UseInterceptors(TenantInterceptor)
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Get()
  list(@Req() req: { tenantId: string }) {
    return this.petsService.list(req.tenantId);
  }

  @Post()
  create(
    @Req() req: { tenantId: string },
    @Body() body: { clientId: string; name: string; species: string; breed?: string },
  ) {
    return this.petsService.create(req.tenantId, body);
  }
}
