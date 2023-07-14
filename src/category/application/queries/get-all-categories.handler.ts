import { Category } from '../../../category/domain/category';
import { CategoryRepository } from '../category-repository.interface';
import { CATEGORY_REPO_TOKEN } from '../../persistence/category-repository.provider';
import { Error } from '../../../application/error';
import { Inject } from '@nestjs/common';
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
        @Inject(CATEGORY_REPO_TOKEN)
        private readonly categoryRepository: CategoryRepository,
    ) {}

    async execute(
        query: GetAllCategoriesQuery,
    ): Promise<Result<Category[]> | Error> {
        return this.categoryRepository.getAll(query.lang);
    }
}
