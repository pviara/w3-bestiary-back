import { createMock } from 'ts-auto-mock';
import { Error } from '../../../application/error';
import { GetAllItemsHandler, GetAllItemsQuery } from './get-all-items.handler';
import { ItemRepository } from '../item-repository.interface';
import { Item } from '../../domain/item';
import { method, On } from 'ts-auto-mock/extension';
import { Result } from '../../../application/result';
import { when } from 'jest-when';

describe('GetAllItemsHandler', () => {
    let sut: GetAllItemsHandler;

    let itemRepository: ItemRepository;

    beforeEach(() => {
        itemRepository = createMock<ItemRepository>();

        sut = new GetAllItemsHandler(itemRepository);
    });

    describe('execute', () => {
        it('should call ItemRepository getAll method with query "lang" property', async () => {
            const query = new GetAllItemsQuery('lang');

            await sut.execute(query);

            expect(itemRepository.getAll).toBeCalledWith(query.lang);
        });

        it('should return an error when repository method returned an error', async () => {
            const query = new GetAllItemsQuery('lang');

            stubItemRepoGetAll(itemRepository, query, new Error(0, ''));

            const result = await sut.execute(query);

            expect(result).toBeInstanceOf(Error);
        });

        it('should return an item result when calling getAll on ItemRepository', async () => {
            const query = new GetAllItemsQuery('lang');

            stubItemRepoGetAll(itemRepository, query, new Result([]));

            const result = await sut.execute(query);

            expect(result).toBeInstanceOf(Result);
        });
    });
});

function stubItemRepoGetAll(
    itemRepository: ItemRepository,
    query: GetAllItemsQuery,
    mocked: Awaited<ReturnType<ItemRepository['getAll']>>,
): void {
    const itemRepoGetAll = On(itemRepository).get(method('getAll'));
    when(itemRepoGetAll).calledWith(query.lang).mockResolvedValue(mocked);
}
