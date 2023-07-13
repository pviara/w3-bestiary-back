import { Category } from '../domain/category';
import { CategoryEntity } from './category-entity';
import { CategoryMapper } from '../../utils/mappers/category.mapper';
import { CategoryRepository } from '../application/category-repository.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';

type CategoryEntityByLang = {
    lang: string;
    categories: CategoryEntity[];
};

export class CategoryRepositoryImplement implements CategoryRepository {
    private _cachedCategoriesByLang: CategoryEntityByLang[] = [];

    constructor(
        @InjectModel('Category')
        private readonly _model: Model<CategoryEntity>,
    ) {}

    async getAll(lang: string): Promise<Category[]> {
        const cached = this._getCategoriesFromCache(lang);
        if (cached) {
            return CategoryMapper.toCategories(cached);
        }

        const aggregate: PipelineStage[] = [
            {
                $match: {},
            },
            {
                $project: {
                    code: 1,
                    names: {
                        $filter: {
                            input: '$names',
                            as: 'names',
                            cond: {
                                $eq: ['$$names.lang', lang],
                            },
                        },
                    },
                },
            },
        ];

        const categoryEntities = await this._model
            .aggregate<CategoryEntity>(aggregate)
            .exec();

        // check that all categories' names have been found with the given language
        const haveAllCategoriesTextesBeenFound = categoryEntities.every(
            (categoryEntity) => categoryEntity.names.length > 0,
        );
        if (!haveAllCategoriesTextesBeenFound) {
            return [];
        }

        this._addCategoriesInCache(lang, categoryEntities);

        return CategoryMapper.toCategories(categoryEntities);
    }

    private _addCategoriesInCache(
        lang: string,
        categoryEntities: CategoryEntity[],
    ): void {
        this._cachedCategoriesByLang.push({
            lang,
            categories: categoryEntities,
        });
    }

    private _getCategoriesFromCache(lang: string): CategoryEntity[] {
        const cached = this._cachedCategoriesByLang.find(
            (cached) => cached.lang === lang,
        );
        if (cached?.categories.length > 0) {
            return cached.categories;
        }
    }
}
