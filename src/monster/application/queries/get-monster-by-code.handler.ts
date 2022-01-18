import { IMonsterRepository } from '../monster-repository.interface';
import { Inject } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Monster } from 'src/monster/domain/monster';

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

    async execute(query: GetMonsterByCodeQuery): Promise<Monster | null> {
        return await this._monsterRepository.getByCode(query.code, query.lang);
    }
}
