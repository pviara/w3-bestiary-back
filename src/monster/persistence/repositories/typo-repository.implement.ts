import { InjectModel } from '@nestjs/mongoose';
import { ITypoRepository } from '../../application/typo-repository.interface';
import { Model, PipelineStage } from 'mongoose';
import { ReportTextTypoCommand } from '../../application/commands/report-text-typo.handler';
import { Typo } from '../../domain/typo';
import { TypoEntity } from '../entities/typo-entity';
import { TypoMapper } from '../../../utils/mappers/typo.mapper';

export class TypoRepositoryImplement implements ITypoRepository {
    constructor(
        @InjectModel('Typo')
        readonly _model: Model<TypoEntity>,
    ) {}

    async create(command: ReportTextTypoCommand): Promise<Typo> {
        const created = await this._model.create({
            lang: command.lang,
            monsterCode: command.monsterCode,
            content: command.content,
        });

        return TypoMapper.toTypo(created);
    }

    async findByExactMatch(
        lang: string,
        monsterCode: string,
        content: string,
    ): Promise<Typo[]> {
        const aggregate: PipelineStage[] = [
            {
                $match: {
                    lang,
                    monsterCode,
                    content,
                },
            },
        ];

        const resemblingTypos = await this._model
            .aggregate<TypoEntity>(aggregate)
            .exec();
        return TypoMapper.toTypos(resemblingTypos);
    }
}
