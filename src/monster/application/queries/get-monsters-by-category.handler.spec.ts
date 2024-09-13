import { Error } from '../../../application/error';
import {
    GetMonstersByCategoriesHandler,
    GetMonstersByCategoriesQuery,
} from './get-monsters-by-category.handler';
import {
    MonsterRepositorySpy,
    stubGetMonstersByCategories,
} from '../../../../test/doubles/monster-repository.spy';
import { Result } from '../../../application/result';

describe('GetMonstersByCategoriesHandler', () => {
    let sut: GetMonstersByCategoriesHandler;

    let monsterRepository: MonsterRepositorySpy;

    beforeEach(() => {
        monsterRepository = new MonsterRepositorySpy();

        sut = new GetMonstersByCategoriesHandler(monsterRepository);
    });

    describe('execute', () => {
        it('should call MonsterRepository getMonstersByCategories method with query "lang" property', async () => {
            const query = new GetMonstersByCategoriesQuery('lang');

            await sut.execute(query);

            expect(
                monsterRepository.calls.getMonstersByCategories.history,
            ).toContain(query.lang);
        });

        it('should return an error when repository method returned an error', async () => {
            const query = new GetMonstersByCategoriesQuery('lang');

            stubGetMonstersByCategories(monsterRepository, new Error(0, ''));

            const result = await sut.execute(query);

            expect(result).toBeInstanceOf(Error);
        });

        it('should return an monster result when calling getMonstersByCategories on MonsterRepository', async () => {
            const query = new GetMonstersByCategoriesQuery('lang');

            stubGetMonstersByCategories(monsterRepository, new Result([]));

            const result = await sut.execute(query);

            expect(result).toBeInstanceOf(Result);
        });
    });
});
