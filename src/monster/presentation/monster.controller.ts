import {
    ApiBadRequestResponse,
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
    Param,
    Query,
    Res,
} from '@nestjs/common';
import { Error } from '../../application/error';
import {
    FileFolder,
    FileFormat,
} from '../../file/application/file-service.interface';
import { GetImageFileQuery } from '../../file/application/queries/get-image-file.handler';
import { GetMonsterByCodeQuery } from '../application/queries/get-monster-by-code.handler';
import { GetMonsterImageURLQuery } from './DTO/get-monster-image.url-query';
import { GetMonstersByCategoriesQuery } from '../application/queries/get-monsters-by-category.handler';
import { GetMonstersURLQuery } from './DTO/get-monsters.url-query';
import { Monster, MonstersByCategory } from '../domain/monster';
import { QueryBus } from '@nestjs/cqrs';
import { ReadStream } from 'fs';
import { Response } from 'express';
import { Result } from '../../application/result';

@ApiTags('monster')
@Controller()
export class MonsterController {
    constructor(private readonly _queryBus: QueryBus) {}

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
        @Query() query: GetMonstersURLQuery,
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
    })
    @ApiNotFoundResponse({
        description: 'No image was found for the given code.',
    })
    @Get('image')
    async getMonsterImage(
        @Query() query: GetMonsterImageURLQuery,
        @Res() response: Response,
    ): Promise<void> {
        const result = await this.executeImageFileQuery(
            query.code,
            FileFolder.MonsterImages,
            FileFormat.PNG,
        );

        this.handleImageFileQueryResult(result, response, query.code, 'image');
    }

    @ApiOperation({
        description: 'Get a specific monster thumbnail by its code.',
    })
    @ApiBadRequestResponse({
        description: 'No code was provided.',
    })
    @ApiOkResponse({
        description: 'Retrieved monster thumbnail.',
    })
    @ApiNotFoundResponse({
        description: 'No thumbnail was found for the given code.',
    })
    @Get('thumbnail')
    async getMonsterThumbnail(
        @Query() query: GetMonsterImageURLQuery,
        @Res() response: Response,
    ): Promise<void> {
        const result = await this.executeImageFileQuery(
            query.code,
            FileFolder.MonsterThumbnails,
            FileFormat.PNG,
        );

        this.handleImageFileQueryResult(
            result,
            response,
            query.code,
            'thumbnail',
        );
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
    @Get(':code')
    async getByCode(
        @Param('code') code: string,
        @Query() query: GetMonstersURLQuery,
    ): Promise<Monster> {
        const getMonsterByCodeQuery = new GetMonsterByCodeQuery(
            code,
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

    private async executeImageFileQuery(
        code: string,
        folder: FileFolder,
        format: FileFormat,
    ): Promise<Result<ReadStream> | Error> {
        const getImageFileQuery = new GetImageFileQuery(code, folder, format);

        const result = await this._queryBus.execute<
            GetImageFileQuery,
            Result<ReadStream> | Error
        >(getImageFileQuery);

        return result;
    }

    private handleImageFileQueryResult(
        result: Result<ReadStream> | Error,
        response: Response,
        code: string,
        resourceType: 'image' | 'thumbnail',
    ): void {
        if (result instanceof Result) {
            response.set({
                'Content-Disposition': `inline; filename=${code}.png`,
                'Content-Type': 'image/png',
            });

            result.data.pipe(response);
        } else {
            throw new HttpException(
                `No ${resourceType} was found for monster with { code: '${code}' }.`,
                result.code,
            );
        }
    }
}
