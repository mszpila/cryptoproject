import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { MainModule } from "./MainModule";

import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

// @Catch()
// export class ExceptionsLoggerFilter extends BaseExceptionFilter {
//   catch(exception: unknown, host: ArgumentsHost) {
//     console.log('Exception thrown', exception);
//     super.catch(exception, host);
//   }
// }

async function bootstrap() {
  const app = await NestFactory.create(MainModule);
  // const { httpAdapter } = app.get(HttpAdapterHost);
  // app.useGlobalFilters(new ExceptionsLoggerFilter(httpAdapter));
  await app.listen(3000);
}

bootstrap();
