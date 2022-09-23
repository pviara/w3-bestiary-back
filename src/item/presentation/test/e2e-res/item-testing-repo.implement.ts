import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Item } from '../../../domain/item';
import { ItemEntity } from '../../../persistence/item-entity';
import { ItemMapper } from '../../../../utils/mappers/item.mapper';
import { ItemRepositoryImplement } from '../../../persistence/item-repository.implement';
import { AnyKeys, Model } from 'mongoose';

@Injectable()
export class ItemTestingRepositoryImplement extends ItemRepositoryImplement {
    constructor(
        @InjectModel('Item')
        readonly _model: Model<ItemEntity>,
    ) {
        super(_model);
    }

    async createTestingValues(lang: string): Promise<Item[]> {
        const items = [
            new Item('test_code-aaa', 'name-aaa'),
            new Item('test_code-bbb', 'name-bbb'),
            new Item('test_code-ccc', 'name-ccc'),
            new Item('test_code-ddd', 'name-ddd'),
            new Item('test_code-eee', 'name-eee'),
        ];
        for (const item of items) {
            await this._model.create<AnyKeys<ItemEntity>>({
                code: item.code,
                names: [
                    {
                        lang,
                        name: item.name,
                    },
                ],
            });
        }

        const created = await this._model.find({});
        return ItemMapper.toItems(created);
    }

    async deleteTestingValues(): Promise<void> {
        await this._model.deleteMany();
    }
}
