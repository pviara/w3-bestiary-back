import { createMock } from 'ts-auto-mock';
import { Error } from '../../../application/error';
import { GetAllItemsHandler, GetAllItemsQuery } from './get-all-items.query';
import { IItemRepository } from '../item-repository.interface';
import { Item } from '../../../item/domain/item';
import { method, On } from 'ts-auto-mock/extension';
import { Result } from '../../../application/result';
import { when } from 'jest-when';

describe('GetAllItemsHandler', () => {
    let sut: GetAllItemsHandler;

    let itemRepository: IItemRepository;

    beforeEach(() => {
        itemRepository = createMock<IItemRepository>();

        sut = new GetAllItemsHandler(itemRepository);
    });

    describe('execute', () => {
        it('should call ItemRepository getAll method with query "lang" property', async () => {
            // arrange
            const query = new GetAllItemsQuery('lang');

            // act
            await sut.execute(query);

            // assert
            expect(itemRepository.getAll).toBeCalledWith(query.lang);
        });

        it('should return an error when no item is found when calling getAll on ItemRepository', async () => {
            // arrange
            const query = new GetAllItemsQuery('lang');

            // act
            const result = await sut.execute(query);

            // assert
            expect(result).toBeInstanceOf(Error);
        });

        it('should return an item result when calling getAll on ItemRepository', async () => {
            // arrange
            const query = new GetAllItemsQuery('lang');

            const itemRepoGetAll = On(itemRepository).get(method('getAll'));
            when(itemRepoGetAll)
                .calledWith(query.lang)
                .mockReturnValue([createMock<Item>()]);

            // act
            const result = await sut.execute(query);

            // assert
            expect(result).toBeInstanceOf(Result);
        });
    });
});
