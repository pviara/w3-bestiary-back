import { createMock } from 'ts-auto-mock';
import { Error } from '../../../application/error';
import {
    GetMonsterByCodeHandler,
    GetMonsterByCodeQuery,
} from './get-monster-by-code.handler';
import { IMonsterRepository } from '../monster-repository.interface';
import { method, On } from 'ts-auto-mock/extension';
import { when } from 'jest-when';

describe('GetMonsterByCodeHandler', () => {
    let sut: GetMonsterByCodeHandler;
    let monsterRepository: IMonsterRepository;

    beforeEach(() => {
        monsterRepository = createMock<IMonsterRepository>();
        sut = new GetMonsterByCodeHandler(monsterRepository);
    });

    describe('execute', () => {
        it('should call MonsterRepository getByCode method with query "code" and "lang" properties', async () => {
            // arrange
            const query = new GetMonsterByCodeQuery('code', 'lang');

            // act
            await sut.execute(query);

            // assert
            expect(monsterRepository.getByCode).toBeCalledWith(
                query.code,
                query.lang,
            );
        });

        it('should return an error when no monster is found when calling getByCode on monsterRepository', async () => {
            // arrange
            const query = new GetMonsterByCodeQuery('code', 'lang');

            const monsterRepoGetByCode = On(monsterRepository).get(
                method('getByCode'),
            );
            when(monsterRepoGetByCode)
                .calledWith(query.code, query.lang)
                .mockReturnValue(null);

            // act
            const result = await sut.execute(query);

            // assert
            expect(result).toBeInstanceOf(Error);
        });
    });
});
