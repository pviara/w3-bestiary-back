import { Category } from '../domain/category';
import { Error } from '../../application/error';
import { Result } from '../../application/result';

export interface CategoryRepository {
    getAll(lang: string): Result<Category[]> | Error;
}
