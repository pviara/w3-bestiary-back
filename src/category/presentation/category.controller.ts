import { Category } from '../domain/category';
import { Controller, Get, NotFoundException, Query, ValidationPipe } from '@nestjs/common';
import { GetAllCategoriesQuery } from '../application/queries/get-all-categories.handler';
import { GetAllCategoriesURLQuery } from './DTO/get-all-categories.url-query';
import { QueryBus } from '@nestjs/cqrs';

@Controller()
export class CategoryController {
    constructor(private readonly _queryBus: QueryBus) {}

    @Get()
    async getAll(
        @Query(new ValidationPipe()) query: GetAllCategoriesURLQuery
    ) {
        const getAllCategoriesQuery = new GetAllCategoriesQuery(query.lang);

        const result = await this
            ._queryBus
            .execute<GetAllCategoriesQuery, Category[]>(getAllCategoriesQuery);

        if (result.length === 0) {
            throw new NotFoundException(
                `At least one category was not found with { lang: '${query.lang}' }.`
            );
        }
        
        return result;
    }
}