import {
    Body,
    Controller,
    Get,
    HttpException,
    Post,
    Query,
    ValidationPipe,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Error } from '../../application/error';
import { GetMonsterByCodeQuery } from '../application/queries/get-monster-by-code.handler';
import { GetMonstersByCategoriesQuery } from '../application/queries/get-monsters-by-category.handler';
import { GetMonstersByCategoriesURLQuery } from './DTO/get-monsters-by-categories.url-query';
import { GetMonsterByCodeURLQuery } from './DTO/get-monster-by-code.url-query';
import { Monster, MonstersByCategory } from '../domain/monster';
import { ReportTextTypoCommand } from '../application/commands/report-text-typo.handler';
import { ReportTextTypoPayload } from './DTO/report-text-typo.payload';
import { Result } from '../../application/result';
import { Typo } from '../domain/typo';

@Controller()
export class MonsterController {
    constructor(
        private readonly _commandBus: CommandBus,
        private readonly _queryBus: QueryBus,
    ) {}

    @Get()
    async getMonstersByCategories(
        @Query(new ValidationPipe()) query: GetMonstersByCategoriesURLQuery,
    ): Promise<MonstersByCategory[]> {
        const getMonstersByCategoryQuery = new GetMonstersByCategoriesQuery(
            query.lang,
        );

        const result = await this._queryBus.execute<
            GetMonstersByCategoriesQuery,
            Result<MonstersByCategory[]> | Error
        >(getMonstersByCategoryQuery);

        if (result instanceof Result) {
            return result.data;
        }

        throw new HttpException(result.message, result.code);
    }

    @Get('search')
    async getByCode(
        @Query(new ValidationPipe()) query: GetMonsterByCodeURLQuery,
    ): Promise<Monster> {
        const getMonsterByCodeQuery = new GetMonsterByCodeQuery(
            query.code,
            query.lang,
        );

        const result = await this._queryBus.execute<
            GetMonsterByCodeQuery,
            Result<Monster> | Error
        >(getMonsterByCodeQuery);

        if (result instanceof Result) {
            return result.data;
        }

        throw new HttpException(result.message, result.code);
    }

    @Post('typo')
    async reportTextTypo(
        @Body(new ValidationPipe()) payload: ReportTextTypoPayload,
    ): Promise<Typo> {
        const command = new ReportTextTypoCommand(
            payload.lang,
            payload.monsterCode,
            payload.typo,
        );

        const result = await this._commandBus.execute<
            ReportTextTypoCommand,
            Result<Typo> | Error
        >(command);

        if (result instanceof Result) {
            return result.data;
        }

        throw new HttpException(result.message, result.code);
    }
}
