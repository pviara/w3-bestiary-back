import { Monster } from '../domain/monster';

export interface IMonsterRepository {
    getAll(lang: string): Promise<Monster[]>;
}
