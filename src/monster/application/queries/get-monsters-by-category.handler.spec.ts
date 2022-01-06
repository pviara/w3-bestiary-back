import { createMock } from 'ts-auto-mock';
import { GetMonstersByCategoriesHandler, GetMonstersByCategoriesQuery } from './get-monsters-by-category.handler';
import { IMonsterRepository } from '../monster-repository.interface';

describe('GetAllMonstersHandler', () => {
    let sut: GetMonstersByCategoriesHandler;
    let monsterRepository: IMonsterRepository;

    beforeEach(() => {
        monsterRepository = createMock<IMonsterRepository>();
        sut = new GetMonstersByCategoriesHandler(monsterRepository);
    });

    describe('execute', () => {
        it('should call MonsterRepository getAll method with query "lang" property', async () => {
            // arrange
            const query = new GetMonstersByCategoriesQuery('lang');
            
            // act
            await sut.execute(query);

            // assert
            expect(monsterRepository.getMonstersByCategories).toBeCalledWith(query.lang);
        });
    });
});