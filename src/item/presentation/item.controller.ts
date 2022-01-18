import {
    Controller,
    Get,
    NotFoundException,
    Query,
    ValidationPipe,
} from '@nestjs/common';
import { GetAllItemsQuery } from '../application/queries/get-all-items.query';
import { GetAllItemsURLQuery } from './DTO/get-all-items.url-query';
import { Item } from '../domain/item';
import { QueryBus } from '@nestjs/cqrs';

@Controller()
export class ItemController {
    constructor(private readonly _queryBus: QueryBus) {}

    @Get()
    async getAll(@Query(new ValidationPipe()) query: GetAllItemsURLQuery) {
        const getAllItemsQuery = new GetAllItemsQuery(query.lang);

        const result = await this._queryBus.execute<GetAllItemsQuery, Item[]>(
            getAllItemsQuery,
        );

        if (result.length === 0) {
            throw new NotFoundException(
                `At least one item was not found with { lang: '${query.lang}' }.`,
            );
        }

        return result;
    }
}
