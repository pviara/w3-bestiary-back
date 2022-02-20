import { IMonsterRepository } from '../monster-repository.interface';
import { Inject } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Monster } from 'src/monster/domain/monster';
import { GitHubService } from 'src/github/application/github.service';

export class GetMonsterByCodeQuery implements IQuery {
    constructor(readonly code: string, readonly lang: string) {}
}

@QueryHandler(GetMonsterByCodeQuery)
export class GetMonsterByCodeHandler
    implements IQueryHandler<GetMonsterByCodeQuery>
{
    constructor(
        private readonly _githubService: GitHubService,

        @Inject('MonsterRepo')
        private readonly _monsterRepository: IMonsterRepository,
    ) {}

    async execute(query: GetMonsterByCodeQuery): Promise<Monster | null> {
        await this._githubService.getRepoIssues();
        return await this._monsterRepository.getByCode(query.code, query.lang);
    }
}
