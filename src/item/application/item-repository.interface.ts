import { Error } from '../../application/error';
import { Item } from '../domain/item';
import { Result } from '../../application/result';

export interface ItemRepository {
    getAll(lang: string): Result<Item[]> | Error;
}
