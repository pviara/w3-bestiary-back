import { Error } from '../../../application/error';
import { Inject } from '@nestjs/common';
import { MonsterRepository } from '../monster-repository.interface';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Monster } from '../../../monster/domain/monster';
import { MONSTER_REPOSITORY_TOKEN } from '../../persistence/repositories/monster-repository.provider';
import { Result } from '../../../application/result';

export class GetMonsterByCodeQuery implements IQuery {
    constructor(
        readonly code: string,
        readonly lang: string,
    ) {}
}

@QueryHandler(GetMonsterByCodeQuery)
export class GetMonsterByCodeHandler
    implements IQueryHandler<GetMonsterByCodeQuery>
{
    constructor(
        @Inject(MONSTER_REPOSITORY_TOKEN)
        private readonly monsterRepository: MonsterRepository,
    ) {}

    async execute(
        query: GetMonsterByCodeQuery,
    ): Promise<Result<Monster> | Error> {
        return this.monsterRepository.getByCode(query.code, query.lang);
    }
}
