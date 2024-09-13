import { Error } from '../../src/application/error';
import { Monster, MonstersByCategory } from '../../src/monster/domain/monster';
import { MonsterRepository } from '../../src/monster/application/monster-repository.interface';
import { Result } from '../../src/application/result';

export class MonsterRepositorySpy implements MonsterRepository {
    calls = {
        getByCode: {
            count: 0,
            history: [] as [string, string][],
        },
        getMonstersByCategories: {
            count: 0,
            history: [] as string[],
        },
    };

    getByCode(code: string, lang: string): Result<Monster> | Error {
        this.incrementCallsToGetByCode([code, lang]);
        return new Result();
    }

    incrementCallsToGetByCode(history: [string, string]): void {
        this.calls.getByCode.count++;
        this.calls.getByCode.history.push(history);
    }

    getMonstersByCategories(
        lang: string,
    ): Result<MonstersByCategory[]> | Error {
        this.incrementCallsToGetMonstersByCategories(lang);
        return new Result();
    }

    incrementCallsToGetMonstersByCategories(lang: string): void {
        this.calls.getMonstersByCategories.count++;
        this.calls.getMonstersByCategories.history.push(lang);
    }
}

export function stubGetByCode(
    repository: MonsterRepositorySpy,
    value: ReturnType<MonsterRepository['getByCode']>,
): void {
    repository.getByCode = (code: string, lang: string): typeof value => {
        repository.incrementCallsToGetByCode([code, lang]);
        return value;
    };
}

export function stubGetMonstersByCategories(
    repository: MonsterRepositorySpy,
    value: ReturnType<MonsterRepository['getMonstersByCategories']>,
): void {
    repository.getMonstersByCategories = (lang: string): typeof value => {
        repository.incrementCallsToGetMonstersByCategories(lang);
        return value;
    };
}
