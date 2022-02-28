import { createMock } from 'ts-auto-mock';
import { Error } from '../../../application/error';
import {
    GetMonstersByCategoriesHandler,
    GetMonstersByCategoriesQuery,
} from './get-monsters-by-category.handler';
import { IMonsterRepository } from '../monster-repository.interface';
import { method, On } from 'ts-auto-mock/extension';
import { when } from 'jest-when';

describe('GetAllMonstersHandler', () => {
    let sut: GetMonstersByCategoriesHandler;
    let monsterRepository: IMonsterRepository;

    beforeEach(() => {
        monsterRepository = createMock<IMonsterRepository>();
        sut = new GetMonstersByCategoriesHandler(monsterRepository);
    });

    describe('execute', () => {
        it('should call MonsterRepository getMonstersByCategories method with query "lang" property', async () => {
            // arrange
            const query = new GetMonstersByCategoriesQuery('lang');

            // act
            await sut.execute(query);

            // assert
            expect(monsterRepository.getMonstersByCategories).toBeCalledWith(
                query.lang,
            );
        });

        it('should return an error when no monster by category is found when calling getMonstersByCategories on MonsterRepository', async () => {
            // arrange
            const query = new GetMonstersByCategoriesQuery('lang');

            const monsterRepoGetMonstersByCategories = On(
                monsterRepository,
            ).get(method('getMonstersByCategories'));
            when(monsterRepoGetMonstersByCategories)
                .calledWith(query.lang)
                .mockReturnValue([]);

            // act
            const result = await sut.execute(query);

            expect(result).toBeInstanceOf(Error);
        });
    });
});
