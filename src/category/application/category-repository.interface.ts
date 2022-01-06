import { Category } from '../domain/category';

export interface ICategoryRepository {
    getAll(lang: string): Promise<Category[]>;
}
