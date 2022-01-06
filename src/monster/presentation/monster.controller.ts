import { Controller, Get, NotFoundException, Param, Query, ValidationPipe } from '@nestjs/common';
import { GetMonsterByCodeQuery } from '../application/queries/get-monster-by-code.handler';
import { GetMonstersByCategoriesQuery } from '../application/queries/get-monsters-by-category.handler';
import { GetMonstersByCategoriesURLQuery } from './DTO/get-monsters-by-categories.url-query';
import { GetMonsterByCodeURLQuery } from './DTO/get-monster-by-code.url-query';
import { Monster, MonstersByCategory } from '../domain/monster';
import { QueryBus } from '@nestjs/cqrs';

@Controller()
export class MonsterController {
    constructor(private readonly _queryBus: QueryBus) {}
    
    @Get()
    async getMonstersByCategories(
        @Query(new ValidationPipe()) query: GetMonstersByCategoriesURLQuery
    ): Promise<MonstersByCategory[]> {
        const getMonstersByCategoryQuery = new GetMonstersByCategoriesQuery(query.lang);

        const result = await this
            ._queryBus
            .execute<GetMonstersByCategoriesQuery, MonstersByCategory[]>(getMonstersByCategoryQuery);

        if (result.length === 0) {
            throw new NotFoundException(
                `At least one monster was not found with { lang: '${query.lang}' }.`
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