import { INestApplication } from '@nestjs/common';
import { MonsterTestingModule } from './e2e-res/monster-testing.module';
import { MonsterTestingRepositoryImplement } from './e2e-res/monster-testing-repo.implement';
import { TestHelper } from '../../../utils/test-helper';
import * as request from 'supertest';

describe('MonsterController', () => {
    let app: INestApplication;

    let monsterTestingRepo: MonsterTestingRepositoryImplement;

    const existingCode = 'bear';
    const existingLang = 'TEST_LANG';

    beforeAll(async () => {
        const module = await TestHelper.buildTestingModule([
            {
                path: 'monster',
                module: MonsterTestingModule,
            },
        ]);

        app = module.createNestApplication();
        await app.init();

        monsterTestingRepo = await app.get('MonsterRepo');
        await monsterTestingRepo.createTestingValues('TEST_LANG');
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

    describe('GET /search', () => {
        it('should return an HTTP error status 400 when no code and lang are given in query', async () => {
            let response = await request(app.getHttpServer()).get(
                '/api/monster/search',
            );
            expect(response.status).toBe(400);

            response = await request(app.getHttpServer()).get(
                '/api/monster/search?lang=ANY',
            );
            expect(response.status).toBe(400);

            response = await request(app.getHttpServer()).get(
                '/api/monster/search?code=any',
            );
            expect(response.status).toBe(400);
        });
        
        it('should return an HTTP error status 404 when no monster has been found for given code and lang', async () => {
            const response = await request(app.getHttpServer()).get(
                '/api/monster/search?lang=NOT_EXISTING&code=any',
            );
            expect(response.status).toBe(404);
        });
        
        it('should return an HTTP status 200 with the right data when given the right code and lang', async () => {
            const [{ code }] = await monsterTestingRepo.monsterModel.find({});
            
            const response = await request(app.getHttpServer()).get(
                `/api/monster/search?lang=${existingLang}&code=${code}`,
            );
            expect(response.status).toBe(200);
            expect(response.body.code).toBe(code);
        });
    });

    afterAll(async () => {
        await monsterTestingRepo.deleteTestingValues();
        await app.close();
    });
});
