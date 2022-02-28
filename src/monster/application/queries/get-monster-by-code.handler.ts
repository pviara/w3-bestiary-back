import { Error } from '../../../application/error';
import { IMonsterRepository } from '../monster-repository.interface';
import { Inject } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Monster } from '../../../monster/domain/monster';
import { Result } from '../../../application/result';

export class GetMonsterByCodeQuery implements IQuery {
    constructor(readonly code: string, readonly lang: string) {}
}

@QueryHandler(GetMonsterByCodeQuery)
export class GetMonsterByCodeHandler
    implements IQueryHandler<GetMonsterByCodeQuery>
{
    constructor(
        @Inject('MonsterRepo')
        private readonly _monsterRepository: IMonsterRepository,
    ) {}

    async execute(
        query: GetMonsterByCodeQuery,
    ): Promise<Result<Monster> | Error> {
        const result = await this._monsterRepository.getByCode(
            query.code,
            query.lang,
        );
        if (!result) {
            return new Error(
                404,
                `No monster was found with { code: '${query.code}', lang: '${query.lang}' }.`,
            );
        }

        return new Result(result);
    }
}
