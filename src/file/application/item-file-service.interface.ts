import { ItemJsonEntity } from 'src/item/persistence/item-json-entity';

export interface ItemFileService {
    getAllItemsFromJsonFile(): ItemJsonEntity[];
}
