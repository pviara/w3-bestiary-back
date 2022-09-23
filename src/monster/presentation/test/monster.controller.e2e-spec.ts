import { INestApplication } from '@nestjs/common';
import { MonsterTestingModule } from './e2e-res/monster-testing.module';
import { MonsterTestingRepositoryImplement } from './e2e-res/monster-testing-repo.implement';
import { TestHelper } from '../../../utils/test-helper';
import * as request from 'supertest';

describe('MonsterController', () => {
    let app: INestApplication;

    let monsterTestingRepo: MonsterTestingRepositoryImplement;

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

    afterAll(async () => {
        await monsterTestingRepo.deleteTestingValues();
        await app.close();
    });
});
