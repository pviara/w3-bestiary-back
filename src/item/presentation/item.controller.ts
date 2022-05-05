import {
    ApiBadRequestResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';
import {
    Controller,
    Get,
    HttpException,
    Query,
    Res,
    ValidationPipe,
} from '@nestjs/common';
import { Error } from '../../application/error';
import { FileFolder, FileFormat } from '../../file/application/file-service.interface';
import { GetAllItemsQuery } from '../application/queries/get-all-items.handler';
import { GetAllItemsURLQuery } from './DTO/get-all-items.url-query';
import { GetImageFileQuery } from '../../file/application/queries/get-image-file.handler';
import { GetItemThumbnailURLQuery } from './DTO/get-item-image.url-query';
import { Item } from '../domain/item';
import { QueryBus } from '@nestjs/cqrs';
import { Response } from 'express';
import { Result } from '../../application/result';
import { ReadStream } from 'fs';

@ApiTags('item')
@Controller()
export class ItemController {
    constructor(private readonly _queryBus: QueryBus) {}

    @ApiOperation({
        description: 'Get items for the given language.',
    })
    @ApiBadRequestResponse({
        description:
            'No language was provided or no such language exists in database.',
    })
    @ApiOkResponse({
        description: 'Retrieved items for the given language.',
        type: Item,
        isArray: true,
    })
    @ApiNotFoundResponse({
        description: 'At least one item was not found for the given language.',
    })
    @Get()
    async getAll(@Query(new ValidationPipe()) query: GetAllItemsURLQuery) {
        const getAllItemsQuery = new GetAllItemsQuery(query.lang);

        const result = await this._queryBus.execute<
            GetAllItemsQuery,
            Result<Item[]> | Error
        >(getAllItemsQuery);

        if (result instanceof Result) {
            return result.data;
        }

        throw new HttpException(result.message, result.code);
    }

    @ApiOperation({
        description: 'Get a specific item thumbnail by its code.',
    })
    @ApiBadRequestResponse({
        description: 'No code was provided.',
    })
    @ApiOkResponse({
        description: 'Retrieved item thumbnail.',
    })
    @ApiNotFoundResponse({
        description: 'No thumbnail was found for the given code.',
    })
    @Get('thumbnail')
    async getItemThumnail(
        @Query(new ValidationPipe()) query: GetItemThumbnailURLQuery,
        @Res() response: Response,
    ): Promise<void> {
        const getImageFileQuery = new GetImageFileQuery(
            query.code,
            FileFolder.ItemThumbnails,
            FileFormat.PNG,
        );

        const result = await this._queryBus.execute<
            GetImageFileQuery,
            Result<ReadStream> | Error
        >(getImageFileQuery);
        
        if (result instanceof Result) {
            response.set({
                'Content-Disposition': `inline; filename=${query.code}.png`,
                'Content-Type': 'image/png',
            });

            result.data.pipe(response);
        } else {
            throw new HttpException(
                `No thumbnail was found for item with { code: '${query.code}' }.`,
                result.code,
            );
        }
    }
}
