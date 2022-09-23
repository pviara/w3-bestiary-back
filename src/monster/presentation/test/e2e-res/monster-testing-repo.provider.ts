import { MonsterTestingRepositoryImplement } from './monster-testing-repo.implement';
import { Provider } from '@nestjs/common';

export const MonsterTestingRepoProvider: Provider = {
    provide: 'MonsterRepo',
    useClass: MonsterTestingRepositoryImplement,
};
