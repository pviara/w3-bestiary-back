import { Category } from '../../../category/domain/category';
import { Error } from '../../../application/error';
import { HttpStatus, Inject } from '@nestjs/common';
import { ICategoryRepository } from '../category-repository.interface';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Result } from '../../../application/result';

export class GetAllCategoriesQuery implements IQuery {
    constructor(readonly lang: string) {}
}

@QueryHandler(GetAllCategoriesQuery)
export class GetAllCategoriesHandler
    implements IQueryHandler<GetAllCategoriesQuery>
{
    constructor(
        @Inject('CategoryRepo')
        private readonly _categoryRepository: ICategoryRepository,
    ) {}

    async execute(
        query: GetAllCategoriesQuery,
    ): Promise<Result<Category[]> | Error> {
        const result = await this._categoryRepository.getAll(query.lang);
        if (result.length === 0) {
            return new Error(
                HttpStatus.NOT_FOUND,
                `At least one category was not found with { lang: '${query.lang}' }.`,
            );
        }

        return new Result(result);
    }
}
