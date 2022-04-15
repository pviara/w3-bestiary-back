import {
    ApiBadRequestResponse,
    ApiExcludeEndpoint,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import {
    Body,
    Controller,
    Get,
    HttpException,
    Post,
    Query,
    Res,
    StreamableFile,
    ValidationPipe,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Error } from '../../application/error';
import { GetMonsterByCodeQuery } from '../application/queries/get-monster-by-code.handler';
import { GetMonstersByCategoriesQuery } from '../application/queries/get-monsters-by-category.handler';
import { GetMonstersByCategoriesURLQuery } from './DTO/get-monsters-by-categories.url-query';
import { GetMonsterByCodeURLQuery } from './DTO/get-monster-by-code.url-query';
import { GetMonsterImageQuery } from '../application/queries/get-monster-image.handler';
import { GetMonsterImageURLQuery } from './DTO/get-monster-image.url-query';
import { Monster, MonstersByCategory } from '../domain/monster';
import { ReportTextTypoCommand } from '../application/commands/report-text-typo.handler';
import { ReportTextTypoPayload } from './DTO/report-text-typo.payload';
import { ReadStream } from 'fs';
import { Response } from 'express';
import { Result } from '../../application/result';
import { Typo } from '../domain/typo';

@ApiTags('monster')
@Controller()
export class MonsterController {
    constructor(
        private readonly _commandBus: CommandBus,
        private readonly _queryBus: QueryBus,
    ) {}

    @ApiOperation({
        description: 'Get monsters by categories for the given language.',
    })
    @ApiBadRequestResponse({
        description:
            'No language was provided or no such language exists in database.',
    })
    @ApiOkResponse({
        description: 'Retrieved monsters by categories for the given language.',
        type: MonstersByCategory,
        isArray: true,
    })
    @ApiNotFoundResponse({
        description:
            'At least one monster was not found for the given language.',
    })
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

    @ApiOperation({
        description: 'Get a specific monster image by its code.',
    })
    @ApiBadRequestResponse({
        description: 'No code was provided.',
    })
    @ApiOkResponse({
        description: 'Retrieved monster image.',
        type: StreamableFile,
    })
    @ApiNotFoundResponse({
        description: 'No image was found for the given code.',
    })
    @Get('image')
    async getMonsterImage(
        @Query(new ValidationPipe()) query: GetMonsterImageURLQuery,
        @Res() response: Response,
    ): Promise<void> {
        const getMonsterImageQuery = new GetMonsterImageQuery(query.code);

        const result = await this._queryBus.execute
            <GetMonsterImageQuery,
            Result<ReadStream> | Error
        >(getMonsterImageQuery);

        if (result instanceof Result) {
            response.set({
                'Content-Disposition': `inline; filename=${query.code}.png`,
                'Content-Type': 'image/png',
            });

            result.data.pipe(response);

        } else {
            throw new HttpException(`No image was found for monster with { code: '${query.code}' }.`, result.code);
        }

    }

    @ApiOperation({
        description:
            'Get a specific monster by its code for the given language.',
    })
    @ApiBadRequestResponse({
        description:
            'No code and/or no language was provided, or no such language exists in database.',
    })
    @ApiOkResponse({
        description: 'Retrieved monster for the given code and language.',
        type: Monster,
    })
    @ApiNotFoundResponse({
        description: 'No monster was found for the given code and language.',
    })
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

    @ApiExcludeEndpoint()
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
