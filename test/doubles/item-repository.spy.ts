import { Error } from '../../src/application/error';
import { Item } from '../../src/item/domain/item';
import { ItemRepository } from '../../src/item/application/item-repository.interface';
import { Result } from '../../src/application/result';

export class ItemRepositorySpy implements ItemRepository {
    calls = {
        getAll: {
            count: 0,
            history: [] as string[],
        },
    };

    getAll(lang: string): Result<Item[]> | Error {
        this.incrementCallsToGetAll(lang);
        return new Result();
    }

    incrementCallsToGetAll(lang: string): void {
        this.calls.getAll.count++;
        this.calls.getAll.history.push(lang);
    }
}

export function stubGetAll(
    repository: ItemRepositorySpy,
    value: ReturnType<ItemRepositorySpy['getAll']>,
): void {
    repository.getAll = (lang: string): typeof value => {
        repository.incrementCallsToGetAll(lang);
        return value;
    };
}
