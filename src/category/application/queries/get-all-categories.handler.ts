import { Inject } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Category } from 'src/category/domain/category';
import { ICategoryRepository } from '../category-repository.interface';

export class GetAllCategoriesQuery implements IQuery {
    constructor(
        readonly lang: string
    ) {}
}

@QueryHandler(GetAllCategoriesQuery)
export class GetAllCategoriesHandler implements IQueryHandler<GetAllCategoriesQuery> {
    constructor(
        @Inject('CategoryRepo')
        private readonly _categoryRepository: ICategoryRepository
    ) {}

    async execute(query: GetAllCategoriesQuery): Promise<Category[]> {
        return await this._categoryRepository.getAll(query.lang);
    }
}
