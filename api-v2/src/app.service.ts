import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  health() {
    return {
      service: 'prime-pet-api-v2',
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
