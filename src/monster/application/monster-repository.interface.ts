import { Monster } from '../domain/monster';

export interface IMonsterRepository {
    getAll(lang: string): Promise<Monster[]>;

    getByCode(code: string, lang: string): Promise<Monster | null>;
}
