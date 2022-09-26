import { Injectable } from '@nestjs/common';
import { AnyKeys } from 'mongoose';
import { Typo } from 'src/monster/domain/typo';
import { TypoEntity } from '../../../persistence/entities/typo-entity';
import { TypoMapper } from '../../../../utils/mappers/typo.mapper';
import { TypoRepositoryImplement } from '../../../persistence/repositories/typo-repository.implement';

@Injectable()
export class TypoTestingRepositoryImplement extends TypoRepositoryImplement {
    async createTestingValue(
        lang: string,
        monsterCode: string,
        typoContent: string,
    ): Promise<Typo> {
        const created = await this._model.create<AnyKeys<TypoEntity>>({
            lang,
            monsterCode,
            content: typoContent,
        });

        return TypoMapper.toTypo(created);
    }
}
