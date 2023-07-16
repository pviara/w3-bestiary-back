import { createMock } from 'ts-auto-mock';
import { Error } from '../../../application/error';
import {
    GetMonsterByCodeHandler,
    GetMonsterByCodeQuery,
} from './get-monster-by-code.handler';
import { method, On } from 'ts-auto-mock/extension';
import { MonsterRepository } from '../monster-repository.interface';
import { Result } from '../../../application/result';
import { when } from 'jest-when';

describe('GetMonsterByCodeHandler', () => {
    let sut: GetMonsterByCodeHandler;

    let monsterRepository: MonsterRepository;

    beforeEach(() => {
        monsterRepository = createMock<MonsterRepository>();

        sut = new GetMonsterByCodeHandler(monsterRepository);
    });

    describe('execute', () => {
        it('should call MonsterRepository getByCode method with query "lang" property', async () => {
            const query = new GetMonsterByCodeQuery('code', 'lang');

            await sut.execute(query);

            expect(monsterRepository.getByCode).toBeCalledWith(
                query.code,
                query.lang,
            );
        });

        it('should return an error when repository method returned an error', async () => {
            const query = new GetMonsterByCodeQuery('code', 'lang');

            stubMonsterRepoGetByCode(
                monsterRepository,
                query,
                new Error(0, ''),
            );

            const result = await sut.execute(query);

            expect(result).toBeInstanceOf(Error);
        });

        it('should return an monster result when calling getByCode on MonsterRepository', async () => {
            const query = new GetMonsterByCodeQuery('code', 'lang');

            stubMonsterRepoGetByCode(monsterRepository, query, new Result());

            const result = await sut.execute(query);

            expect(result).toBeInstanceOf(Result);
        });
    });
});

function stubMonsterRepoGetByCode(
    monsterRepository: MonsterRepository,
    query: GetMonsterByCodeQuery,
    mocked: Awaited<ReturnType<MonsterRepository['getByCode']>>,
): void {
    const monsterRepoGetByCode = On(monsterRepository).get(method('getByCode'));
    when(monsterRepoGetByCode)
        .calledWith(query.code, query.lang)
        .mockResolvedValue(mocked);
}
