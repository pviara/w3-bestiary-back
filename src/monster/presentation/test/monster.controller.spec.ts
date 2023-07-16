import { createMock } from 'ts-auto-mock';
import { Error } from '../../../application/error';
import { GetMonsterImageURLQuery } from '../DTO/get-monster-image.url-query';
import { GetMonstersURLQuery } from '../DTO/get-monsters.url-query';
import { HttpException } from '@nestjs/common';
import { method, On } from 'ts-auto-mock/extension';
import {
    Monster,
    MonsterForCategory,
    MonstersByCategory,
    MonstersByCategoryCategory,
} from '../../domain/monster';
import { MonsterController } from '../monster.controller';
import { QueryBus } from '@nestjs/cqrs';
import { ReadStream } from 'fs';
import { Result } from '../../../application/result';
import { Response } from 'express';
import { when } from 'jest-when';

describe('MonsterController', () => {
    let sut: MonsterController;

    let queryBusMock: QueryBus;

    beforeEach(() => {
        queryBusMock = createMock<QueryBus>();

        sut = new MonsterController(queryBusMock);
    });

    describe('getByCode', () => {
        it('should call execute on queryBus with given query', async () => {
            const getMonsterByCodeURLQuery: GetMonstersURLQuery = {
                lang: 'lang',
            };

            const codeParam: string = 'code';

            const queryBusMockExecute = On(queryBusMock).get(method('execute'));
            when(queryBusMockExecute).mockReturnValue(
                new Result(createMock<Monster>()),
            );

            await sut.getByCode(codeParam, getMonsterByCodeURLQuery);

            expect(queryBusMock.execute).toBeCalled();
        });

        it('should throw an HttpException when execution result is an Error', async () => {
            const getMonsterByCodeURLQuery: GetMonstersURLQuery = {
                lang: 'lang',
            };

            const codeParam: string = 'code';

            const queryBusMockExecute = On(queryBusMock).get(method('execute'));
            when(queryBusMockExecute).mockReturnValue(new Error(0, ''));

            expect(
                async () =>
                    await sut.getByCode(codeParam, getMonsterByCodeURLQuery),
            ).rejects.toThrow(HttpException);
        });

        it('should return a Monster when execution result is an object of type Result', async () => {
            const getMonsterByCodeURLQuery: GetMonstersURLQuery = {
                lang: 'lang',
            };

            const codeParam: string = 'code';

            const monsterMock = new Monster(
                '',
                '',
                {
                    description: '',
                    name: '',
                    quote: {
                        author: {
                            firstname: '',
                            lastname: '',
                            title: '',
                        },
                        text: '',
                    },
                },
                {
                    bombs: [],
                    oils: [],
                    potions: [],
                    signs: [],
                },
            );

            const queryBusMockExecute = On(queryBusMock).get(method('execute'));
            when(queryBusMockExecute).mockReturnValue(new Result(monsterMock));

            const result = await sut.getByCode(
                codeParam,
                getMonsterByCodeURLQuery,
            );

            expect(result).toBeInstanceOf(Monster);
        });
    });

    describe('getMonstersByCategories', () => {
        it('should call execute on queryBus with given query', async () => {
            const getMonstersByCategoriesURLQuery: GetMonstersURLQuery = {
                lang: 'lang',
            };

            const queryBusMockExecute = On(queryBusMock).get(method('execute'));
            when(queryBusMockExecute).mockReturnValue(
                new Result<MonstersByCategory[]>([]),
            );

            await sut.getMonstersByCategories(getMonstersByCategoriesURLQuery);

            expect(queryBusMock.execute).toBeCalled();
        });

        it('should throw an HttpException when execution result is an Error', async () => {
            const getMonstersByCategoriesURLQuery: GetMonstersURLQuery = {
                lang: 'lang',
            };

            const queryBusMockExecute = On(queryBusMock).get(method('execute'));
            when(queryBusMockExecute).mockReturnValue(new Error(0, ''));

            expect(
                async () =>
                    await sut.getMonstersByCategories(
                        getMonstersByCategoriesURLQuery,
                    ),
            ).rejects.toThrow(HttpException);
        });

        it('should return an array of MonstersByCategories when execution result is an object of type Result', async () => {
            const getMonstersByCategoriesURLQuery: GetMonstersURLQuery = {
                lang: 'lang',
            };

            const monstersByCategoryByCategoryMock =
                new MonstersByCategoryCategory('', '');
            const monsterByCategoryMock = new MonsterForCategory('', {
                name: ' ',
            });
            const monstersByCategoryMock = new MonstersByCategory(
                monstersByCategoryByCategoryMock,
                [monsterByCategoryMock],
            );

            const queryBusMockExecute = On(queryBusMock).get(method('execute'));
            when(queryBusMockExecute).mockReturnValue(
                new Result([monstersByCategoryMock]),
            );

            const result = await sut.getMonstersByCategories(
                getMonstersByCategoriesURLQuery,
            );

            expect(Array.isArray(result)).toBe(true);
            expect(result[0]).toBeInstanceOf(MonstersByCategory);
        });
    });

    describe('getMonsterImage', () => {
        it('should call execute on queryBus with given query', async () => {
            const getMonsterImageURLQuery: GetMonsterImageURLQuery = {
                code: 'code',
            };

            const queryBusMockExecute = On(queryBusMock).get(method('execute'));
            when(queryBusMockExecute).mockReturnValue(
                new Result(createMock<ReadStream>()),
            );

            await sut.getMonsterImage(
                getMonsterImageURLQuery,
                createMock<Response>(),
            );

            expect(queryBusMock.execute).toBeCalled();
        });

        it('should throw an HttpException when execution result is an Error', async () => {
            const getMonsterImageURLQuery: GetMonsterImageURLQuery = {
                code: 'code',
            };

            const queryBusMockExecute = On(queryBusMock).get(method('execute'));
            when(queryBusMockExecute).mockReturnValue(new Error(0, ''));

            expect(
                async () =>
                    await sut.getMonsterImage(
                        getMonsterImageURLQuery,
                        createMock<Response>(),
                    ),
            ).rejects.toThrow(HttpException);
        });

        it('should return nothing when execution result is an object of type Result', async () => {
            const getMonsterImageURLQuery: GetMonsterImageURLQuery = {
                code: 'code',
            };

            const readStream = createMock<ReadStream>();

            const queryBusMockExecute = On(queryBusMock).get(method('execute'));
            when(queryBusMockExecute).mockReturnValue(new Result(readStream));

            const result = await sut.getMonsterImage(
                getMonsterImageURLQuery,
                createMock<Response>(),
            );

            expect(result).toBe(undefined);
        });
    });

    describe('getMonsterThumbnail', () => {
        it('should call execute on queryBus with given query', async () => {
            const getMonsterImageURLQuery: GetMonsterImageURLQuery = {
                code: 'code',
            };

            const queryBusMockExecute = On(queryBusMock).get(method('execute'));
            when(queryBusMockExecute).mockReturnValue(
                new Result(createMock<ReadStream>()),
            );

            await sut.getMonsterThumbnail(
                getMonsterImageURLQuery,
                createMock<Response>(),
            );

            expect(queryBusMock.execute).toBeCalled();
        });

        it('should throw an HttpException when execution result is an Error', async () => {
            const getMonsterImageURLQuery: GetMonsterImageURLQuery = {
                code: 'code',
            };

            const queryBusMockExecute = On(queryBusMock).get(method('execute'));
            when(queryBusMockExecute).mockReturnValue(new Error(0, ''));

            expect(
                async () =>
                    await sut.getMonsterThumbnail(
                        getMonsterImageURLQuery,
                        createMock<Response>(),
                    ),
            ).rejects.toThrow(HttpException);
        });

        it('should return nothing when execution result is an object of type Result', async () => {
            const getMonsterImageURLQuery: GetMonsterImageURLQuery = {
                code: 'code',
            };

            const readStream = createMock<ReadStream>();

            const queryBusMockExecute = On(queryBusMock).get(method('execute'));
            when(queryBusMockExecute).mockReturnValue(new Result(readStream));

            const result = await sut.getMonsterThumbnail(
                getMonsterImageURLQuery,
                createMock<Response>(),
            );

            expect(result).toBe(undefined);
        });
    });
});
