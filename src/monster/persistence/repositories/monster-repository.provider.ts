import { MonsterJsonRepository } from './monster-json-repository';
import { Provider } from '@nestjs/common';

export const MONSTER_REPOSITORY_TOKEN = 'MonsterRepo';

export const MonsterRepoProvider: Provider = {
    provide: MONSTER_REPOSITORY_TOKEN,
    useClass: MonsterJsonRepository,
};
