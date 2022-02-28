import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { Error } from '../../application/error';
import { GetAllItemsQuery } from '../application/queries/get-all-items.query';
import { GetAllItemsURLQuery } from './DTO/get-all-items.url-query';
import { Item } from '../domain/item';
import { QueryBus } from '@nestjs/cqrs';
import { Result } from '../../application/result';

@Controller()
export class ItemController {
    constructor(private readonly _queryBus: QueryBus) {}

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

        result.throw();
    }
}
