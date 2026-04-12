import { Body, Controller, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';

import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TenantInterceptor } from '../../common/interceptors/tenant.interceptor';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
@UseInterceptors(TenantInterceptor)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('enqueue')
  enqueue(
    @Req() req: { tenantId: string },
    @Body() body: { channel: 'whatsapp' | 'email'; to: string; templateCode: string },
  ) {
    return this.notificationsService.enqueue(req.tenantId, body);
  }
}
