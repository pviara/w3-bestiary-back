import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { createStream } from 'rotating-file-stream';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { InternalServerErrorException } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as morgan from 'morgan';
import helmet from 'helmet';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const configService = app.get<ConfigService>(ConfigService);
    const currentEnv = configService.get<string>('APP_ENV');
    if (!currentEnv) {
        throwMissingEnvVariableError('APP_ENV');
    }

    const filesPath = configService.get<string>('FILES_PATH');
    if (!filesPath) {
        throwMissingEnvVariableError('FILES_PATH');
    }

    if (currentEnv === 'DEV') {
        app.enableCors();
    } else {
        app.use(helmet());
    }

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

    const swaggerConfig = new DocumentBuilder()
        .setTitle('The Witcher 3 Bestiary')
        .setDescription(
            'API documentation for The Witcher 3 Bestiary application.',
        )
        .setLicense('MIT License', 'https://opensource.org/licenses/MIT')
        .build();

    const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

    SwaggerModule.setup('apiDocs', app, swaggerDocument);

    const port = configService.get<string | undefined>('APP_PORT');
    await app.listen(port || 3000);
}
bootstrap();

function throwMissingEnvVariableError(varName: string): void {
    throw new InternalServerErrorException(
        `Missing required environment variable "${varName}".`,
    );
}
