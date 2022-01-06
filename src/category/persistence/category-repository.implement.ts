import { Category } from '../domain/category';
import { CategoryEntity } from './category-entity';
import { ICategoryRepository } from '../application/category-repository.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { CategoryMapper } from 'src/utils/mappers/category.mapper';

export class CategoryRepositoryImplement implements ICategoryRepository {
    constructor(
        @InjectModel('Category')
        private readonly _model: Model<CategoryEntity>
    ) {}

    async getAll(lang: string): Promise<Category[]> {
        const aggregate: PipelineStage[] = [{
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
                            $eq: [
                                '$$names.lang',
                                lang
                            ]
                        }
                    }
                },
            }
        }];

        const categoryEntities = await this
            ._model
            .aggregate<CategoryEntity>(aggregate)
            .exec();

        // check that all categories' names have been found with the given language
        const haveAllCategoriesTextesBeenFound = categoryEntities
            .every(
                categoryEntity => categoryEntity.names.length > 0
            );
        if (!haveAllCategoriesTextesBeenFound) {
            return [];
        }

        return CategoryMapper.toCategories(categoryEntities);
    }
}
