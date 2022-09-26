import { Provider } from '@nestjs/common';
import { TypoTestingRepositoryImplement } from './typo-testing-repo.implement';

export const TypoTestingRepoProvider: Provider = {
    provide: 'TypoRepo',
    useClass: TypoTestingRepositoryImplement,
};
