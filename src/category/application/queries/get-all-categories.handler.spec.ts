import {
    CategoryRepositorySpy,
    stubGetAll,
} from '../../../../test/doubles/category-repository.spy';
import { Error } from '../../../application/error';
import {
    GetAllCategoriesHandler,
    GetAllCategoriesQuery,
} from './get-all-categories.handler';
import { Result } from '../../../application/result';

describe('GetAllCategoriesHandler', () => {
    let sut: GetAllCategoriesHandler;

    let categoryRepository: CategoryRepositorySpy;

    beforeEach(() => {
        categoryRepository = new CategoryRepositorySpy();
        sut = new GetAllCategoriesHandler(categoryRepository);
    });

    describe('execute', () => {
        it('should call CategoryRepository getAll method with query "lang" property', async () => {
            const query = new GetAllCategoriesQuery('lang');

            await sut.execute(query);

            expect(categoryRepository.calls.getAll.history).toContain(
                query.lang,
            );
        });

        it('should return an error when repository method returned an error', async () => {
            const query = new GetAllCategoriesQuery('lang');

            stubGetAll(categoryRepository, new Error(0, ''));

            const result = await sut.execute(query);

            expect(result).toBeInstanceOf(Error);
        });

        it('should return a category result repository method returned a result', async () => {
            const query = new GetAllCategoriesQuery('lang');

            stubGetAll(categoryRepository, new Result([]));

            const result = await sut.execute(query);

            expect(result).toBeInstanceOf(Result);
        });
    });
});
