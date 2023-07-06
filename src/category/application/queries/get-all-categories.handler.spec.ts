import { Category } from '../../domain/category';
import { createMock } from 'ts-auto-mock';
import { Error } from '../../../application/error';
import {
    GetAllCategoriesHandler,
    GetAllCategoriesQuery,
} from './get-all-categories.handler';
import { ICategoryRepository } from '../category-repository.interface';
import { method, On } from 'ts-auto-mock/extension';
import { Result } from '../../../application/result';
import { when } from 'jest-when';

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

        it('should return an error when no category is found when calling getAll on CategoryRepository', async () => {
            // arrange
            const query = new GetAllCategoriesQuery('lang');

            // act
            const result = await sut.execute(query);

            // assert
            expect(result).toBeInstanceOf(Error);
        });

        it('should return a category result when calling getAll on CategoryRepository', async () => {
            // arrange
            const query = new GetAllCategoriesQuery('lang');

            const categoryRepoGetAllCategories = On(categoryRepository).get(
                method('getAll'),
            );
            when(categoryRepoGetAllCategories)
                .calledWith(query.lang)
                .mockReturnValue([createMock<Category>()]);

            // act
            const result = await sut.execute(query);

            // assert
            expect(result).toBeInstanceOf(Result);
        });
    });
});
