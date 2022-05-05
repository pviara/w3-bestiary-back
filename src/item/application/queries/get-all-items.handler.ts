import { Error } from '../../../application/error';
import { IItemRepository } from '../item-repository.interface';
import { Inject } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Item } from '../../domain/item';
import { Result } from '../../../application/result';

export class GetAllItemsQuery implements IQuery {
    constructor(readonly lang: string) {}
}

@QueryHandler(GetAllItemsQuery)
export class GetAllItemsHandler implements IQueryHandler<GetAllItemsQuery> {
    constructor(
        @Inject('ItemRepo')
        private readonly _itemRepository: IItemRepository,
    ) {}

    async execute(query: GetAllItemsQuery): Promise<Result<Item[]> | Error> {
        const result = await this._itemRepository.getAll(query.lang);
        if (result.length === 0) {
            return new Error(
                404,
                `At least one item was not found with { lang: '${query.lang}' }.`,
            );
        }

        return new Result(result);
    }
}
