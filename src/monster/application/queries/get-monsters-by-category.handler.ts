import { Error } from '../../../application/error';
import { Inject } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { MonsterRepository } from '../monster-repository.interface';
import { MonstersByCategory } from '../../../monster/domain/monster';
import { MONSTER_REPOSITORY_TOKEN } from '../../persistence/repositories/monster-repository.provider';
import { Result } from '../../../application/result';

export class GetMonstersByCategoriesQuery implements IQuery {
    constructor(readonly lang: string) {}
}

@QueryHandler(GetMonstersByCategoriesQuery)
export class GetMonstersByCategoriesHandler
    implements IQueryHandler<GetMonstersByCategoriesQuery>
{
    constructor(
        @Inject(MONSTER_REPOSITORY_TOKEN)
        private readonly monsterRepository: MonsterRepository,
    ) {}

    async execute(
        query: GetMonstersByCategoriesQuery,
    ): Promise<Result<MonstersByCategory[]> | Error> {
        return this.monsterRepository.getMonstersByCategories(query.lang);
    }
}
