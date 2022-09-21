import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ItemEntity } from '../../../persistence/item-entity';
import { ItemRepositoryImplement } from '../../../persistence/item-repository.implement';
import { Model } from 'mongoose';

@Injectable()
export class ItemTestingRepositoryImplement extends ItemRepositoryImplement {
    constructor(
        @InjectModel('Item')
        readonly _model: Model<ItemEntity>,
    ) {
        super(_model);
    }

    async getTest() {
        return await this._model.find({});
    }
}
