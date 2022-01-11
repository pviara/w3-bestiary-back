import { IItemRepository } from "../item-repository.interface";
import { Inject } from "@nestjs/common";
import { IQuery, IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Item } from "src/item/domain/item";

export class GetAllItemsQuery implements IQuery {
    constructor(
        readonly lang: string
    ) {}
}

@QueryHandler(GetAllItemsQuery)
export class GetAllItemsHandler implements IQueryHandler<GetAllItemsQuery> {
    constructor(
        @Inject('ItemRepo')
        private readonly _itemRepository: IItemRepository
    ) {}
    
    async execute(query: GetAllItemsQuery): Promise<Item[]> {
        return await this._itemRepository.getAll(query.lang);
    }
}
