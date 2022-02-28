import { Error } from '../../..//application/error';
import { IMonsterRepository } from '../monster-repository.interface';
import { Inject } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { MonstersByCategory } from '../../../monster/domain/monster';
import { Result } from '../../../application/result';

export class GetMonstersByCategoriesQuery implements IQuery {
    constructor(readonly lang: string) {}
}

@QueryHandler(GetMonstersByCategoriesQuery)
export class GetMonstersByCategoriesHandler
    implements IQueryHandler<GetMonstersByCategoriesQuery>
{
    constructor(
        @Inject('MonsterRepo')
        private readonly _monsterRepository: IMonsterRepository,
    ) {}

    async execute(
        query: GetMonstersByCategoriesQuery,
    ): Promise<Result<MonstersByCategory[]> | Error> {
        const result = await this._monsterRepository.getMonstersByCategories(
            query.lang,
        );
        if (result.length === 0) {
            return new Error(
                404,
                `At least one monster was not found with { lang: '${query.lang}' }.`,
            );
        }

        return new Result(result);
    }
}
