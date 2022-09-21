import { INestApplication } from '@nestjs/common';
import { ItemTestingModule } from './e2e-res/item-testing.module';
import { ItemTestingRepositoryImplement } from './e2e-res/item-testing-repo.implement';
import { TestHelper } from '../../../utils/test-helper';
import * as request from 'supertest';

describe('VersionController', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const module = await TestHelper.buildTestingModule([
            {
                path: 'item',
                module: ItemTestingModule,
            },
        ]);

        app = module.createNestApplication();
        await app.init();

        const result = await app.get(ItemTestingRepositoryImplement).getTest();
        console.warn(result);
    });

    describe('GET /', () => {
        it('should return an HTTP error status when given result is an error', async () => {
            await request(app.getHttpServer()).get('/api/item').expect(404);
        });

        it('should return an HTTP error status when given result is an error', async () => {
            await request(app.getHttpServer()).get('/api/item').expect(404);
        });
    });

    afterAll(async () => {
        await app.close();
    });
});
