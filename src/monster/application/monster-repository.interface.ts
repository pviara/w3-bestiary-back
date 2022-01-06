import { Monster, MonstersByCategory } from '../domain/monster';

export interface IMonsterRepository {
    getMonstersByCategories(lang: string): Promise<MonstersByCategory[]>;

    getByCode(code: string, lang: string): Promise<Monster | null>;
}
