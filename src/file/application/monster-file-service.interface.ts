import { CategoryFileService } from './category-file-service.interface';
import { MonsterJsonEntity } from '../../monster/persistence/entities/monster-json-entity';

export interface MonsterFileService extends CategoryFileService {
    getAllMonsterFromJsonFile(): MonsterJsonEntity[];
}
