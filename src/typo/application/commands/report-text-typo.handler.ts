import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ITypoRepository } from '../typo-repository.interface';
import { Typo } from 'src/typo/domain/typo';

export class ReportTextTypoCommand implements ICommand {
    constructor(
        readonly lang: string,
        readonly monsterCode: string,
        readonly content: string,
    ) {}
}

@CommandHandler(ReportTextTypoCommand)
export class ReportTextTypoHandler
    implements ICommandHandler<ReportTextTypoCommand>
{
    constructor(
        @Inject('TypoRepo')
        private readonly _typoRepository: ITypoRepository,
    ) {}

    async execute(command: ReportTextTypoCommand): Promise<Typo | null> {
        const existingSimilarTypo =
            await this._typoRepository.findByResemblance(
                command.lang,
                command.monsterCode,
                command.content,
            );
        if (existingSimilarTypo) {
            return null;
        }

        return await this._typoRepository.create(command);
    }
}
