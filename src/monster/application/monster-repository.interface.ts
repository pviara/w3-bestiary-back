import { Error } from '../../application/error';
import { Monster, MonstersByCategory } from '../domain/monster';
import { Result } from '../../application/result';

export interface MonsterRepository {
    getMonstersByCategories(lang: string): Result<MonstersByCategory[]> | Error;
    getByCode(code: string, lang: string): Result<Monster> | Error;
}
