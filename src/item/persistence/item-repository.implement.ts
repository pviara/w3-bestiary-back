import { IItemRepository } from '../application/item-repository.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Item } from '../domain/item';
import { ItemEntity } from './item-entity';
import { ItemMapper } from 'src/utils/mappers/item.mapper';
import { Model, PipelineStage } from 'mongoose';

type ItemEntityByLang = {
    lang: string;
    items: ItemEntity[];
};

export class ItemRepositoryImplement implements IItemRepository {
    private _cachedItemsByLang: ItemEntityByLang[] = [];

    constructor(
        @InjectModel('Item')
        private readonly _model: Model<ItemEntity>,
    ) {}

    async getAll(lang: string): Promise<Item[]> {
        const cached = this._getItemsFromCache(lang);
        if (cached) {
            return ItemMapper.toItems(cached);
        }

        const aggregate: PipelineStage[] = [
            {
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
                                $eq: ['$$names.lang', lang],
                            },
                        },
                    },
                },
            },
        ];

        const itemEntities = await this._model
            .aggregate<ItemEntity>(aggregate)
            .exec();

        // check that all categories' names have been found with the given language
        const haveAllCategoriesTextesBeenFound = itemEntities.every(
            (itemEntity) => itemEntity.names.length > 0,
        );
        if (!haveAllCategoriesTextesBeenFound) {
            return [];
        }

        this._addItemsInCache(lang, itemEntities);

        return ItemMapper.toItems(itemEntities);
    }

    private _addItemsInCache(lang: string, itemEntities: ItemEntity[]): void {
        this._cachedItemsByLang.push({
            lang,
            items: itemEntities,
        });
    }

    private _getItemsFromCache(lang: string): ItemEntity[] {
        const cached = this._cachedItemsByLang.find(
            (cached) => cached.lang === lang,
        );
        if (cached?.items.length > 0) {
            return cached.items;
        }
    }
}
