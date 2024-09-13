import { Category } from '../../src/category/domain/category';
import { CategoryRepository } from '../../src/category/application/category-repository.interface';
import { Error } from '../../src/application/error';
import { Result } from '../../src/application/result';

export class CategoryRepositorySpy implements CategoryRepository {
    calls = {
        getAll: {
            count: 0,
            history: [] as string[],
        },
    };

    getAll(lang: string): Result<Category[]> | Error {
        this.incrementCallsToGetAll(lang);
        return new Result();
    }

    incrementCallsToGetAll(lang: string): void {
        this.calls.getAll.count++;
        this.calls.getAll.history.push(lang);
    }
}

export function stubGetAll(
    repository: CategoryRepositorySpy,
    value: ReturnType<CategoryRepository['getAll']>,
): void {
    repository.getAll = (lang: string): typeof value => {
        repository.incrementCallsToGetAll(lang);
        return value;
    };
}
