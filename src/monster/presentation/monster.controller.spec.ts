import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { createMock } from 'ts-auto-mock';
import { Error } from '../../application/error';
import { GetMonsterByCodeURLQuery } from './DTO/get-monster-by-code.url-query';
import { GetMonsterImageURLQuery } from './DTO/get-monster-image.url-query';
import { GetMonstersByCategoriesURLQuery } from './DTO/get-monsters-by-categories.url-query';
import { HttpException } from '@nestjs/common';
import { method, On } from 'ts-auto-mock/extension';
import {
    Monster,
    MonsterByCategory,
    MonstersByCategory,
    MonstersByCategoryCategory,
} from '../domain/monster';
import { MonsterController } from './monster.controller';
import { ReportTextTypoPayload } from './DTO/report-text-typo.payload';
import { Result } from '../../application/result';
import { Typo } from '../domain/typo';
import { when } from 'jest-when';
import { Response } from 'express';
import { ReadStream } from 'fs';

describe('MonsterController', () => {
    let sut: MonsterController;

    let commandBusMock: CommandBus;
    let queryBusMock: QueryBus;

    beforeEach(() => {
        commandBusMock = createMock<CommandBus>();
        queryBusMock = createMock<QueryBus>();

        sut = new MonsterController(commandBusMock, queryBusMock);
    });

    describe('getMonstersByCategories', () => {
        it('should call execute on queryBus with given query', async () => {
            const getMonstersByCategoriesURLQuery: GetMonstersByCategoriesURLQuery =
                {
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
            const getMonstersByCategoriesURLQuery: GetMonstersByCategoriesURLQuery =
                {
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
            const getMonstersByCategoriesURLQuery: GetMonstersByCategoriesURLQuery =
                {
                    lang: 'lang',
                };

            const monstersByCategoryByCategoryMock =
                new MonstersByCategoryCategory('', '');
            const monsterByCategoryMock = new MonsterByCategory('', {
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

    describe('getByCode', () => {
        it('should call execute on queryBus with given query', async () => {
            const getMonsterByCodeURLQuery: GetMonsterByCodeURLQuery = {
                code: 'code',
                lang: 'lang',
            };

            const queryBusMockExecute = On(queryBusMock).get(method('execute'));
            when(queryBusMockExecute).mockReturnValue(
                new Result(createMock<Monster>()),
            );

            await sut.getByCode(getMonsterByCodeURLQuery);

            expect(queryBusMock.execute).toBeCalled();
        });

        it('should throw an HttpException when execution result is an Error', async () => {
            const getMonsterByCodeURLQuery: GetMonsterByCodeURLQuery = {
                code: 'code',
                lang: 'lang',
            };

            const queryBusMockExecute = On(queryBusMock).get(method('execute'));
            when(queryBusMockExecute).mockReturnValue(new Error(0, ''));

            expect(
                async () => await sut.getByCode(getMonsterByCodeURLQuery),
            ).rejects.toThrow(HttpException);
        });

        it('should return a Monster when execution result is an object of type Result', async () => {
            const getMonsterByCodeURLQuery: GetMonsterByCodeURLQuery = {
                code: 'code',
                lang: 'lang',
            };

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

            const result = await sut.getByCode(getMonsterByCodeURLQuery);

            expect(result).toBeInstanceOf(Monster);
        });
    });

    describe('reportTextTypo', () => {
        it('should call execute on commandBus with given query', async () => {
            const reportTextTypoPayload: ReportTextTypoPayload = {
                lang: 'lang',
                monsterCode: 'code',
                typo: 'typo',
            };

            const commandBusMockExecute = On(commandBusMock).get(
                method('execute'),
            );
            when(commandBusMockExecute).mockReturnValue(
                new Result(createMock<Typo>()),
            );

            await sut.reportTextTypo(reportTextTypoPayload);

            expect(commandBusMock.execute).toBeCalled();
        });

        it('should throw an HttpException when execution result is an Error', async () => {
            const reportTextTypoPayload: ReportTextTypoPayload = {
                lang: 'lang',
                monsterCode: 'code',
                typo: 'typo',
            };

            const commandBusMockExecute = On(commandBusMock).get(
                method('execute'),
            );
            when(commandBusMockExecute).mockReturnValue(new Error(0, ''));

            expect(
                async () => await sut.reportTextTypo(reportTextTypoPayload),
            ).rejects.toThrow(HttpException);
        });

        it('should return a Typo when execution result is an object of type Result', async () => {
            const reportTextTypoPayload: ReportTextTypoPayload = {
                lang: 'lang',
                monsterCode: 'code',
                typo: 'typo',
            };

            const typoMock = new Typo('', '', '', '');

            const commandBusMockExecute = On(commandBusMock).get(
                method('execute'),
            );
            when(commandBusMockExecute).mockReturnValue(new Result(typoMock));

            const result = await sut.reportTextTypo(reportTextTypoPayload);

            expect(result).toBeInstanceOf(Typo);
        });
    });
});
