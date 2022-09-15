import { createMock } from 'ts-auto-mock';
import { Error } from '../../application/error';
import { GetAllItemsURLQuery } from './DTO/get-all-items.url-query';
import { GetItemThumbnailURLQuery } from './DTO/get-item-image.url-query';
import { HttpException } from '@nestjs/common';
import { Item } from '../domain/item';
import { ItemController } from './item.controller';
import { method, On } from 'ts-auto-mock/extension';
import { QueryBus } from '@nestjs/cqrs';
import { ReadStream } from 'fs';
import { Response } from 'express';
import { Result } from '../../application/result';
import { when } from 'jest-when';

describe('ItemController', () => {
    let sut: ItemController;

    let queryBusMock: QueryBus;

    beforeEach(() => {
        queryBusMock = createMock<QueryBus>();

        sut = new ItemController(queryBusMock);
    });

    describe('getAll', () => {
        it('should call execute on queryBus with given query', async () => {
            const getAllItemsURLQuery: GetAllItemsURLQuery = {
                lang: 'lang',
            };

            const queryBusMockExecute = On(queryBusMock).get(method('execute'));
            when(queryBusMockExecute).mockReturnValue(
                new Result([createMock<Item>()]),
            );

            await sut.getAll(getAllItemsURLQuery);

            expect(queryBusMock.execute).toBeCalled();
        });

        it('should throw an HttpException when execution result is an Error', async () => {
            const getAllItemsURLQuery: GetAllItemsURLQuery = {
                lang: 'lang',
            };

            const queryBusMockExecute = On(queryBusMock).get(method('execute'));
            when(queryBusMockExecute).mockReturnValue(new Error(0, ''));

            expect(
                async () => await sut.getAll(getAllItemsURLQuery),
            ).rejects.toThrow(HttpException);
        });

        it('should return an array of Items when execution result is an object of type Result', async () => {
            const getAllItemsURLQuery: GetAllItemsURLQuery = {
                lang: 'lang',
            };

            const queryBusMockExecute = On(queryBusMock).get(method('execute'));
            when(queryBusMockExecute).mockReturnValue(
                new Result([new Item('', '')]),
            );

            const result = await sut.getAll(getAllItemsURLQuery);

            expect(Array.isArray(result)).toBe(true);
            expect(result[0]).toBeInstanceOf(Item);
        });
    });

    describe('getItemThumbnail', () => {
        it('should call execute on queryBus with given query', async () => {
            const getItemThumbnailURLQuery: GetItemThumbnailURLQuery = {
                code: 'code',
            };

            const queryBusMockExecute = On(queryBusMock).get(method('execute'));
            when(queryBusMockExecute).mockReturnValue(
                new Result(createMock<ReadStream>()),
            );

            await sut.getItemThumnail(
                getItemThumbnailURLQuery,
                createMock<Response>(),
            );

            expect(queryBusMock.execute).toBeCalled();
        });

        it('should throw an HttpException when execution result is an Error', async () => {
            const getMonsterImageURLQuery: GetItemThumbnailURLQuery = {
                code: 'code',
            };

            const queryBusMockExecute = On(queryBusMock).get(method('execute'));
            when(queryBusMockExecute).mockReturnValue(new Error(0, ''));

            expect(
                async () =>
                    await sut.getItemThumnail(
                        getMonsterImageURLQuery,
                        createMock<Response>(),
                    ),
            ).rejects.toThrow(HttpException);
        });

        it('should return nothing when execution result is an object of type Result', async () => {
            const getMonsterImageURLQuery: GetItemThumbnailURLQuery = {
                code: 'code',
            };

            const readStream = createMock<ReadStream>();

            const queryBusMockExecute = On(queryBusMock).get(method('execute'));
            when(queryBusMockExecute).mockReturnValue(new Result(readStream));

            const result = await sut.getItemThumnail(
                getMonsterImageURLQuery,
                createMock<Response>(),
            );

            expect(result).toBe(undefined);
        });
    });
});
