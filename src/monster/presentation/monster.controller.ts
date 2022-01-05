import { Controller, Get, NotFoundException, Param, Query, ValidationPipe } from '@nestjs/common';
import { GetAllMonstersQuery } from '../application/queries/get-all-monsters.handler';
import { GetAllMonstersURLQuery } from './DTO/get-all-monsters.url-query';
import { GetMonsterByCodeURLQuery } from './DTO/get-monster-by-code.url-query';
import { Monster } from '../domain/monster';
import { QueryBus } from '@nestjs/cqrs';
import { GetMonsterByCodeQuery } from '../application/queries/get-monster-by-code.handler';

@Controller()
export class MonsterController {
    constructor(private readonly _queryBus: QueryBus) {}
    
    @Get()
    async getAll(
        @Query(new ValidationPipe()) query: GetAllMonstersURLQuery
    ): Promise<Monster[]> {
        const getAllMonstersQuery = new GetAllMonstersQuery(query.lang);

        const result = await this
            ._queryBus
            .execute<GetAllMonstersQuery, Monster[]>(getAllMonstersQuery);

        if (result.length === 0) {
            throw new NotFoundException(
                `No monster was found with { lang: '${query.lang}' }.`
            );
        }
        
        return result;
    }
    
    @Get('search')
    async getByCode(
        @Query(new ValidationPipe()) query: GetMonsterByCodeURLQuery
    ): Promise<Monster> {
        const getMonsterByCodeQuery = new GetMonsterByCodeQuery(query.code, query.lang);

        const result = await this
            ._queryBus
            .execute<GetMonsterByCodeQuery, Monster>(getMonsterByCodeQuery);

        if (!result) {
            throw new NotFoundException(
                `No monster was found with { code: '${query.code}', lang: '${query.lang}' }.`
            );
        }

        return result;
    }
}