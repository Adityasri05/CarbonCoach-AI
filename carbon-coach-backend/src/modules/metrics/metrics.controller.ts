import { Controller, Get, Header, HttpCode, HttpStatus } from '@nestjs/common';
import * as client from 'prom-client';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Monitoring')
@Controller('metrics')
export class MetricsController {
  constructor() {
    // Collect default CPU/Memory/Process metrics
    client.collectDefaultMetrics();
  }

  // Create custom counter for request count
  private readonly httpRequestsTotal = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests processed',
    labelNames: ['method', 'route', 'status'],
  });

  @ApiOperation({ summary: 'Expose Prometheus system performance metrics' })
  @Get()
  @Header('Content-Type', client.register.contentType)
  @HttpCode(HttpStatus.OK)
  async getMetrics(): Promise<string> {
    return client.register.metrics();
  }
}
