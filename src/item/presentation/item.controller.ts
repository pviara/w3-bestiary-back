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
    ValidationPipe,
} from '@nestjs/common';
import { Error } from '../../application/error';
import { GetAllItemsQuery } from '../application/queries/get-all-items.query';
import { GetAllItemsURLQuery } from './DTO/get-all-items.url-query';
import { Item } from '../domain/item';
import { QueryBus } from '@nestjs/cqrs';
import { Result } from '../../application/result';

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
}
