import { CategoryJsonEntity } from '../../category/persistence/category-json-entity';

export interface CategoryFileService {
    getAllMonsterCategoriesFromJsonFile(): CategoryJsonEntity[];
}
