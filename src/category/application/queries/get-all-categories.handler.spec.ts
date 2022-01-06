import { createMock } from 'ts-auto-mock';
import { GetAllCategoriesHandler, GetAllCategoriesQuery } from './get-all-categories.handler';
import { ICategoryRepository } from '../category-repository.interface';

describe('GetAllCategoriesHandler', () => {
    let sut: GetAllCategoriesHandler;
    let categoryRepository: ICategoryRepository;

    beforeEach(() => {
        categoryRepository = createMock<ICategoryRepository>();

        sut = new GetAllCategoriesHandler(categoryRepository);
    });

    describe('execute', () => {
        it('should call CategoryRepository getAll method with query "lang" property', async () => {
            // arrange
            const query = new GetAllCategoriesQuery('lang');

            // act
            await sut.execute(query);

            // assert
            expect(categoryRepository.getAll).toBeCalledWith(query.lang);
        });
    });
});
