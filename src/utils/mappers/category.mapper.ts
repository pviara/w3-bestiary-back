import { Category } from '../../category/domain/category';
import { CategoryEntity } from '../../category/persistence/category-entity';

export class CategoryMapper {
    static toCategory(categoryEntity: CategoryEntity): Category {
        const categoryEntityNames = categoryEntity.names[0];
        return new Category(categoryEntity.code, categoryEntityNames.name);
    }

    static toCategories(categoryEntities: CategoryEntity[]): Category[] {
        return categoryEntities.map((categoryEntity) =>
            this.toCategory(categoryEntity),
        );
    }
}
