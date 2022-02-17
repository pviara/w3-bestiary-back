import { Provider } from '@nestjs/common';
import { TypoRepositoryImplement } from './typo-repository.implement';

export const TypoRepoProvider: Provider = {
    provide: 'TypoRepo',
    useClass: TypoRepositoryImplement,
};
