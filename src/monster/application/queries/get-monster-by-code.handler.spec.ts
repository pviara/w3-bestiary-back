import { Error } from '../../../application/error';
import {
    GetMonsterByCodeHandler,
    GetMonsterByCodeQuery,
} from './get-monster-by-code.handler';
import {
    MonsterRepositorySpy,
    stubGetByCode,
} from '../../../../test/doubles/monster-repository.spy';
import { Result } from '../../../application/result';

describe('GetMonsterByCodeHandler', () => {
    let sut: GetMonsterByCodeHandler;

    let monsterRepository: MonsterRepositorySpy;

    beforeEach(() => {
        monsterRepository = new MonsterRepositorySpy();

        sut = new GetMonsterByCodeHandler(monsterRepository);
    });

    describe('execute', () => {
        it('should call MonsterRepository getByCode method with query "lang" property', async () => {
            const query = new GetMonsterByCodeQuery('code', 'lang');

            await sut.execute(query);

            expect(monsterRepository.calls.getByCode.history).toContainEqual([
                query.code,
                query.lang,
            ]);
        });

        it('should return an error when repository method returned an error', async () => {
            const query = new GetMonsterByCodeQuery('code', 'lang');

            stubGetByCode(monsterRepository, new Error(0, ''));

            const result = await sut.execute(query);

            expect(result).toBeInstanceOf(Error);
        });

        it('should return an monster result when calling getByCode on MonsterRepository', async () => {
            const query = new GetMonsterByCodeQuery('code', 'lang');

            stubGetByCode(monsterRepository, new Result());

            const result = await sut.execute(query);

            expect(result).toBeInstanceOf(Result);
        });
    });
});
