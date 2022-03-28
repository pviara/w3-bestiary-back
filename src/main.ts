import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { createStream } from 'rotating-file-stream';
import { NestFactory } from '@nestjs/core';
import * as morgan from 'morgan';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();

    const configService = app.get<ConfigService>(ConfigService);
    const LOGS_PATH = configService.get<string>('LOGS_PATH');

    const logStream = createStream('logs.log', {
        interval: '1d',
        path: LOGS_PATH,
    });

    morgan.token('angle-bracket', () => '>');
    morgan.token('timestamp', () => new Date().toISOString());
    app.use(
        morgan(
            ':angle-bracket :timestamp :method :url :status :res[content-length] - :response-time ms',
            { stream: logStream },
        ),
    );

    await app.listen(3000);
}
bootstrap();
