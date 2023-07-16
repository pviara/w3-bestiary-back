import { Error } from '../../application/error';
import { Monster, MonstersByCategory } from '../domain/monster';
import { Result } from '../../application/result';

export interface MonsterRepository {
    getByCode(code: string, lang: string): Result<Monster> | Error;
    getMonstersByCategories(lang: string): Result<MonstersByCategory[]> | Error;
}
