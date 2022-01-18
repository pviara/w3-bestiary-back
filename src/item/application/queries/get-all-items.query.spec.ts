import { createMock } from 'ts-auto-mock';
import { GetAllItemsHandler, GetAllItemsQuery } from './get-all-items.query';
import { IItemRepository } from '../item-repository.interface';

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
    });
});
