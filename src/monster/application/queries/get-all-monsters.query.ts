import { IMonsterRepository } from '../monster-repository.interface';
import { Inject } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Monster } from 'src/monster/domain/monster';

export class GetAllMonstersQuery implements IQuery {
    constructor(
        readonly lang: string
    ) {}
}

@QueryHandler(GetAllMonstersQuery)
export class GetAllMonstersHandler implements IQueryHandler<GetAllMonstersQuery> {
    constructor(
        @Inject('MonsterRepo')
        private readonly _monsterRepository: IMonsterRepository
    ) {}

    async execute(query: GetAllMonstersQuery): Promise<Monster[]> {
       return await this._monsterRepository.getAll(query.lang); 
    }
}