import { createMock } from 'ts-auto-mock';
import {
    GetMonsterByCodeHandler,
    GetMonsterByCodeQuery,
} from './get-monster-by-code.handler';
import { IMonsterRepository } from '../monster-repository.interface';

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
    });
});
