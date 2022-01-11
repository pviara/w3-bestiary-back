import { IItemRepository } from "../application/item-repository.interface";
import { ItemEntity } from "./item-entity";
import { InjectModel } from "@nestjs/mongoose";
import { Item } from "../domain/item";
import { Model } from "mongoose";

export class ItemRepositoryImplement implements IItemRepository {
    constructor(
        @InjectModel('Item')
        private readonly _model: Model<ItemEntity>
    ) {}
    
    getAll(lang: string): Promise<Item[]> {
        throw new Error("Method not implemented.");
    }

}