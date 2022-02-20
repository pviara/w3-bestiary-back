import { ReportTextTypoCommand } from '../../monster/application/commands/report-text-typo.handler';
import { Typo } from '../domain/typo';

export interface ITypoRepository {
    create(command: ReportTextTypoCommand): Promise<Typo>;
    findByExactMatch(
        lang: string,
        monsterCode: string,
        content: string,
    ): Promise<Typo[]>;
}
