import { IMonsterRepository } from '../monster-repository.interface';
import { Inject } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { MonstersByCategory } from 'src/monster/domain/monster';

export class GetMonstersByCategoriesQuery implements IQuery {
    constructor(
        readonly lang: string
    ) {}
}

@QueryHandler(GetMonstersByCategoriesQuery)
export class GetMonstersByCategoriesHandler implements IQueryHandler<GetMonstersByCategoriesQuery> {
    constructor(
        @Inject('MonsterRepo')
        private readonly _monsterRepository: IMonsterRepository
    ) {}

    async execute(query: GetMonstersByCategoriesQuery): Promise<MonstersByCategory[]> {
        return await this._monsterRepository.getMonstersByCategories(query.lang);
    }
}
