// lib/common/logger/logger.module.ts
import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
            colorize: true,
            levelFirst: true,
            translateTime: 'SYS:standard',
            messageFormat: '{msg} {req.method} {req.url} {res.statusCode}',
            ignore:
              'pid,hostname,req.remotePort,req.remoteAddress,req.headers,res.headers',
          },
        },
        autoLogging: false,
        customLogLevel: function (req, res, err) {
          if (res.statusCode >= 400 && res.statusCode < 500) {
            return 'warn';
          }
          if (res.statusCode >= 500 || err) {
            return 'error';
          }
          return 'info';
        },
      },
    }),
  ],
  exports: [PinoLoggerModule],
})
export class LoggerModule {}
