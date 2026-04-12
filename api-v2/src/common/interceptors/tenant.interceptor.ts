import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const tenantHeader = request.headers['x-tenant-id'];
    request.tenantId = typeof tenantHeader === 'string' ? tenantHeader : request.user?.tenantId;

    return next.handle();
  }
}
