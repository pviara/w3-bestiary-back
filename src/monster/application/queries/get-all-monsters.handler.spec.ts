import { createMock } from 'ts-auto-mock';
import { GetAllMonstersHandler, GetAllMonstersQuery } from './get-all-monsters.handler';
import { IMonsterRepository } from '../monster-repository.interface';

describe('GetAllMonstersHandler', () => {
    let sut: GetAllMonstersHandler;
    let monsterRepository: IMonsterRepository;

    beforeEach(() => {
        monsterRepository = createMock<IMonsterRepository>();
        sut = new GetAllMonstersHandler(monsterRepository);
    });

    describe('execute', () => {
        it('should call MonsterRepository getAll method with query "lang" property', async () => {
            // arrange
            const query = new GetAllMonstersQuery('lang');
            
            // act
            await sut.execute(query);

            // assert
            expect(monsterRepository.getAll).toBeCalledWith(query.lang);
        });
    });
});