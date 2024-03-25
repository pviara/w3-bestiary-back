import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { createStream } from 'rotating-file-stream';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
    ForbiddenException,
    InternalServerErrorException,
    ValidationPipe,
} from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

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

    if (currentEnv === 'PROD') {
        const corsOptions: CorsOptions = {
            origin: (origin, callback) => {
                const allowedOrigin =
                    configService.get<string>('ALLOWED_ORIGIN');
                const isOriginAllowed = !origin || allowedOrigin === origin;

                if (isOriginAllowed) {
                    callback(null, true);
                } else {
                    callback(
                        new ForbiddenException(
                            'CORS: Request origin is not allowed',
                        ),
                    );
                }
            },
        };
        app.enableCors(corsOptions);
    } else {
        app.enableCors();
    }

    app.useGlobalPipes(new ValidationPipe());

    const LOGS_PATH = configService.get<string>('LOGS_PATH');

    const logStream = createStream('logs.log', {
        interval: '1d',
        path: LOGS_PATH,
    });

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
