import { CategoryRepository } from '../category-repository.interface';
import { createMock } from 'ts-auto-mock';
import { Error } from '../../../application/error';
import {
    GetAllCategoriesHandler,
    GetAllCategoriesQuery,
} from './get-all-categories.handler';
import { method, On } from 'ts-auto-mock/extension';
import { Result } from '../../../application/result';
import { when } from 'jest-when';

describe('GetAllCategoriesHandler', () => {
    let sut: GetAllCategoriesHandler;

    let categoryRepository: CategoryRepository;

    beforeEach(() => {
        categoryRepository = createMock<CategoryRepository>();

        sut = new GetAllCategoriesHandler(categoryRepository);
    });

    describe('execute', () => {
        it('should call CategoryRepository getAll method with query "lang" property', async () => {
            const query = new GetAllCategoriesQuery('lang');

            await sut.execute(query);

            expect(categoryRepository.getAll).toBeCalledWith(query.lang);
        });

        it('should return an error when repository method returned an error', async () => {
            const query = new GetAllCategoriesQuery('lang');

            stubCategoryRepoGetAll(categoryRepository, query, new Error(0, ''));

            const result = await sut.execute(query);

            expect(result).toBeInstanceOf(Error);
        });

        it('should return a category result repository method returned a result', async () => {
            const query = new GetAllCategoriesQuery('lang');

            stubCategoryRepoGetAll(categoryRepository, query, new Result([]));

            const result = await sut.execute(query);

            expect(result).toBeInstanceOf(Result);
        });
    });
});

function stubCategoryRepoGetAll(
    categoryRepository: CategoryRepository,
    query: GetAllCategoriesQuery,
    mocked: Awaited<ReturnType<CategoryRepository['getAll']>>,
): void {
    const categoryRepoGetAll = On(categoryRepository).get(method('getAll'));
    when(categoryRepoGetAll).calledWith(query.lang).mockResolvedValue(mocked);
}
