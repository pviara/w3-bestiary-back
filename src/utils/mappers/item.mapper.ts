import { Item } from 'src/item/domain/item';
import { ItemEntity } from 'src/item/persistence/item-entity';

export class ItemMapper {
    static toItem(itemEntity: ItemEntity): Item {
        const categoryEntityNames = itemEntity.names[0];
        return new Item(
            itemEntity.code,
            categoryEntityNames.name
        );
    }

    static toItems(itemEntities: ItemEntity[]): Item[] {
        return itemEntities
            .map(
                itemEntity => this.toItem(itemEntity)
            );
    }
}