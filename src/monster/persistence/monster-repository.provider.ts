import { MonsterRepositoryImplement } from './monster-repository.implement';
import { Provider } from '@nestjs/common';

export const MonsterRepoProvider: Provider = {
    provide: 'MonsterRepo',
    useClass: MonsterRepositoryImplement
};
