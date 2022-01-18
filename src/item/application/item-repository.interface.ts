import { Item } from '../domain/item';

export interface IItemRepository {
    getAll(lang: string): Promise<Item[]>;
}
