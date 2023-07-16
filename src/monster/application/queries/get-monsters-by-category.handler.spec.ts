import { createMock } from 'ts-auto-mock';
import { Error } from '../../../application/error';
import {
    GetMonstersByCategoriesHandler,
    GetMonstersByCategoriesQuery,
} from './get-monsters-by-category.handler';
import { method, On } from 'ts-auto-mock/extension';
import { MonsterRepository } from '../monster-repository.interface';
import { Result } from '../../../application/result';
import { when } from 'jest-when';

describe('GetMonstersByCategoriesHandler', () => {
    let sut: GetMonstersByCategoriesHandler;

    let monsterRepository: MonsterRepository;

    beforeEach(() => {
        monsterRepository = createMock<MonsterRepository>();

        sut = new GetMonstersByCategoriesHandler(monsterRepository);
    });

    describe('execute', () => {
        it('should call MonsterRepository getMonstersByCategories method with query "lang" property', async () => {
            const query = new GetMonstersByCategoriesQuery('lang');

            await sut.execute(query);

            expect(monsterRepository.getMonstersByCategories).toBeCalledWith(
                query.lang,
            );
        });

        it('should return an error when repository method returned an error', async () => {
            const query = new GetMonstersByCategoriesQuery('lang');

            stubMonsterRepoGetMonstersByCategories(
                monsterRepository,
                query,
                new Error(0, ''),
            );

            const result = await sut.execute(query);

            expect(result).toBeInstanceOf(Error);
        });

        it('should return an monster result when calling getMonstersByCategories on MonsterRepository', async () => {
            const query = new GetMonstersByCategoriesQuery('lang');

            stubMonsterRepoGetMonstersByCategories(
                monsterRepository,
                query,
                new Result([]),
            );

            const result = await sut.execute(query);

            expect(result).toBeInstanceOf(Result);
        });
    });
});

function stubMonsterRepoGetMonstersByCategories(
    monsterRepository: MonsterRepository,
    query: GetMonstersByCategoriesQuery,
    mocked: Awaited<ReturnType<MonsterRepository['getMonstersByCategories']>>,
): void {
    const monsterRepoGetMonstersByCategories = On(monsterRepository).get(
        method('getMonstersByCategories'),
    );
    when(monsterRepoGetMonstersByCategories)
        .calledWith(query.lang)
        .mockResolvedValue(mocked);
}
