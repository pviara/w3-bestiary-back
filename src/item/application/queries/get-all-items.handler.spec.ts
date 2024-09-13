import { Error } from '../../../application/error';
import { GetAllItemsHandler, GetAllItemsQuery } from './get-all-items.handler';
import {
    ItemRepositorySpy,
    stubGetAll,
} from '../../../../test/doubles/item-repository.spy';
import { Result } from '../../../application/result';

describe('GetAllItemsHandler', () => {
    let sut: GetAllItemsHandler;

    let itemRepository: ItemRepositorySpy;

    beforeEach(() => {
        itemRepository = new ItemRepositorySpy();

        sut = new GetAllItemsHandler(itemRepository);
    });

    describe('execute', () => {
        it('should call ItemRepository getAll method with query "lang" property', async () => {
            const query = new GetAllItemsQuery('lang');

            await sut.execute(query);

            expect(itemRepository.calls.getAll.history).toContain(query.lang);
        });

        it('should return an error when repository method returned an error', async () => {
            const query = new GetAllItemsQuery('lang');

            stubGetAll(itemRepository, new Error(0, ''));

            const result = await sut.execute(query);

            expect(result).toBeInstanceOf(Error);
        });

        it('should return an item result when calling getAll on ItemRepository', async () => {
            const query = new GetAllItemsQuery('lang');

            stubGetAll(itemRepository, new Result([]));

            const result = await sut.execute(query);

            expect(result).toBeInstanceOf(Result);
        });
    });
});
