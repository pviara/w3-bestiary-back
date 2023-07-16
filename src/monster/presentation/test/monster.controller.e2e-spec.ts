import { ConfigService } from '@nestjs/config';
import { FileFolder } from '../../../file/application/file-service.interface';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { MonsterModule } from '../../monster.module';
import { TestHelper } from '../../../utils/test-helper';
import * as request from 'supertest';

describe('MonsterController', () => {
    let app: INestApplication;

    const existingCode = 'bear';
    const existingLang = 'EN';

    beforeAll(async () => {
        const module = await TestHelper.buildTestingModule([
            {
                path: 'monster',
                module: MonsterModule,
            },
        ]);

        app = module.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();

        const configService = app.get<ConfigService>(ConfigService);
        const filesPath = configService.get<string>('FILES_PATH');
        for (const folder of [
            FileFolder.MonsterImages,
            FileFolder.MonsterThumbnails,
        ]) {
            await TestHelper.createTestingImages(
                filesPath,
                folder,
                existingCode,
            );
        }
    });

    describe('GET /', () => {
        it('should return an HTTP error status 400 when no lang is given in query', async () => {
            const response = await request(app.getHttpServer()).get(
                '/api/monster',
            );
            expect(response.status).toBe(400);
        });

        it('should return an HTTP error status 404 when no monster was found with given lang', async () => {
            const response = await request(app.getHttpServer()).get(
                '/api/monster?lang=not_existing',
            );
            expect(response.status).toBe(404);
        });

        it('should return an HTTP status 200 with the right data when given the right lang', async () => {
            const response = await request(app.getHttpServer()).get(
                `/api/monster?lang=${existingLang}`,
            );

            expect(response.status).toBe(200);
            expect(response.body).toBeTruthy();
            expect(response.body.length).toBeGreaterThanOrEqual(1);
        });
    });

    describe('GET /image', () => {
        it('should return an HTTP error status 400 when no code is given in query', async () => {
            const response = await request(app.getHttpServer()).get(
                '/api/monster/image',
            );
            expect(response.status).toBe(400);
        });

        it('should return an HTTP error status 404 when no image was found with given code', async () => {
            const response = await request(app.getHttpServer()).get(
                '/api/monster/image?code=not_existing',
            );
            expect(response.status).toBe(404);
        });

        it('should return an HTTP status 200 with the right image when given the right code', async () => {
            const response = await request(app.getHttpServer()).get(
                `/api/monster/image?code=${existingCode}`,
            );
            expect(response.status).toBe(200);
            expect(Buffer.isBuffer(response.body)).toBe(true);
        });
    });

    describe('GET /thumbnail', () => {
        it('should return an HTTP error status 400 when no code is given in query', async () => {
            const response = await request(app.getHttpServer()).get(
                '/api/monster/thumbnail',
            );
            expect(response.status).toBe(400);
        });

        it('should return an HTTP error status 404 when no thumbnail was found with given code', async () => {
            const response = await request(app.getHttpServer()).get(
                '/api/monster/thumbnail?code=not_existing',
            );
            expect(response.status).toBe(404);
        });

        it('should return an HTTP status 200 with the right thumbnail when given the right code', async () => {
            const response = await request(app.getHttpServer()).get(
                `/api/monster/thumbnail?code=${existingCode}`,
            );
            expect(response.status).toBe(200);
            expect(Buffer.isBuffer(response.body)).toBe(true);
        });
    });

    describe('GET /:code', () => {
        it('should return an HTTP error status 404 when no monster has been found for given code and lang', async () => {
            const response = await request(app.getHttpServer()).get(
                '/api/monster/any?lang=NOT_EXISTING',
            );
            expect(response.status).toBe(404);
        });

        it('should return an HTTP status 200 with the right data when given the right code and lang', async () => {
            const response = await request(app.getHttpServer()).get(
                `/api/monster/${existingCode}?lang=${existingLang}`,
            );
            expect(response.status).toBe(200);
            expect(response.body.code).toBe(existingCode);
        });
    });

    afterAll(async () => {
        await app.close();
    });
});
