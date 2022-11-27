import { ConfigService } from '@nestjs/config';
import { FileFolder } from '../../../file/application/file-service.interface';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Item } from '../../domain/item';
import { ItemTestingModule } from './e2e-res/item-testing.module';
import { ItemTestingRepositoryImplement } from './e2e-res/item-testing-repo.implement';
import { TestHelper } from '../../../utils/test-helper';
import * as request from 'supertest';

describe('ItemController', () => {
    let app: INestApplication;

    let itemTestingRepo: ItemTestingRepositoryImplement;
    let items: Item[];

    const existingLang = 'TEST_LANG';
    const existingCode = 'blizzard';

    beforeAll(async () => {
        const module = await TestHelper.buildTestingModule([
            {
                path: 'item',
                module: ItemTestingModule,
            },
        ]);

        app = module.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();

        itemTestingRepo = await app.get('ItemRepo');
        items = await itemTestingRepo.createTestingValues(existingLang);

        const configService = app.get<ConfigService>(ConfigService);
        const filesPath = configService.get<string>('FILES_PATH');
        await TestHelper.createTestingImages(
            filesPath,
            FileFolder.ItemThumbnails,
            existingCode,
        );
    });

    describe('GET /', () => {
        it('should return an HTTP error status 400 when no lang is given in query', async () => {
            const response = await request(app.getHttpServer()).get(
                '/api/item',
            );
            expect(response.status).toBe(400);
        });

        it('should return an HTTP error status 404 when no item was found with given lang', async () => {
            const response = await request(app.getHttpServer()).get(
                '/api/item?lang=NOT_EXISTING',
            );
            expect(response.status).toBe(404);
        });

        it('should return an HTTP status 200 with the right data when given the right lang', async () => {
            const response = await request(app.getHttpServer()).get(
                `/api/item?lang=${existingLang}`,
            );
            expect(response.status).toBe(200);
            expect(response.body).toEqual(items);
        });
    });

    describe('GET /thumbnail', () => {
        it('should return an HTTP error status 400 when no code is given in query', async () => {
            const response = await request(app.getHttpServer()).get(
                '/api/item/thumbnail',
            );
            expect(response.status).toBe(400);
        });

        it('should return an HTTP error status 404 when no thumbnail was found with given code', async () => {
            const response = await request(app.getHttpServer()).get(
                '/api/item/thumbnail?code=not_existing',
            );
            expect(response.status).toBe(404);
        });

        it('should return an HTTP status 200 with the right thumbnail when given the right code', async () => {
            const response = await request(app.getHttpServer()).get(
                `/api/item/thumbnail?code=${existingCode}`,
            );
            expect(response.status).toBe(200);
            expect(Buffer.isBuffer(response.body)).toBe(true);
        });
    });

    afterAll(async () => {
        await itemTestingRepo.deleteTestingValues();
        await app.close();
    });
});
