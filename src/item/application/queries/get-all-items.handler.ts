import { Error } from '../../../application/error';
import { Inject } from '@nestjs/common';
import { ItemRepository } from '../item-repository.interface';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Item } from '../../domain/item';
import { ITEM_REPOSITORY_TOKEN } from '../../persistence/item-repository.provider';
import { Result } from '../../../application/result';

export class GetAllItemsQuery implements IQuery {
    constructor(readonly lang: string) {}
}

@QueryHandler(GetAllItemsQuery)
export class GetAllItemsHandler implements IQueryHandler<GetAllItemsQuery> {
    constructor(
        @Inject(ITEM_REPOSITORY_TOKEN)
        private readonly itemRepository: ItemRepository,
    ) {}

    async execute(query: GetAllItemsQuery): Promise<Result<Item[]> | Error> {
        return this.itemRepository.getAll(query.lang);
    }
}
