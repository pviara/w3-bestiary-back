import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import * as morgan from 'morgan';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    
    morgan.token('angle-bracket', () => '>');
    morgan.token('timestamp', () => new Date().toISOString());
    app.use(
        morgan(':angle-bracket :timestamp :method :url :status :res[content-length] - :response-time ms')
    );

    await app.listen(3000);
}
bootstrap();
