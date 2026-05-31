import { CallHandler, ExecutionContext, ForbiddenException, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const tenantHeader = request.headers['x-tenant-id'];
    const jwtTenantId = request.user?.tenantId;

    if (typeof tenantHeader === 'string' && tenantHeader !== jwtTenantId) {
      throw new ForbiddenException('Tenant ID mismatch');
    }

    request.tenantId = jwtTenantId;

    return next.handle();
  }
}
