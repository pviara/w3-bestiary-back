import { Category } from '../domain/category';
import { CategoryFileService } from '../../file/application/category-file-service.interface';
import { CategoryRepository } from '../application/category-repository.interface';
import { Error } from '../../application/error';
import { FILE_SERVICE_TOKEN } from '../../file/application/file-service.provider';
import { HttpStatus, Inject } from '@nestjs/common';
import { Result } from '../../application/result';

export class CategoryJsonRepository implements CategoryRepository {
    constructor(
        @Inject(FILE_SERVICE_TOKEN)
        private readonly fileService: CategoryFileService,
    ) {}

    getAll(lang: string): Result<Category[]> | Error {
        const categoryEntities =
            this.fileService.getAllMonsterCategoriesFromJsonFile();

        const categories = categoryEntities.map<Category>((categoryEntity) => {
            const targetCategoryName = categoryEntity.names.find(
                (categoryName) => categoryName.lang === lang,
            );
            if (targetCategoryName) {
                return new Category(
                    categoryEntity.code,
                    targetCategoryName.name,
                );
            }
        });

        if (categories.includes(undefined)) {
            return new Error(
                HttpStatus.NOT_FOUND,
                `Given lang "${lang}" didn't match at least one category's name language.`,
            );
        }

        return new Result(categories);
    }
}
