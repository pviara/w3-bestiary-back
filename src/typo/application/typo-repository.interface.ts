import { ReportTextTypoCommand } from './commands/report-text-typo.handler';
import { Typo } from '../domain/typo';

export interface ITypoRepository {
    create(command: ReportTextTypoCommand): Promise<Typo>;
    findByResemblance(
        lang: string,
        monsterCode: string,
        content: string,
    ): Promise<Typo | undefined>;
}
