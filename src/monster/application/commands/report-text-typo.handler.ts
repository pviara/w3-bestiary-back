import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { IMonsterRepository } from '../monster-repository.interface';
import { Inject } from '@nestjs/common';
import { ITypoRepository } from '../../application/typo-repository.interface';
import { Typo } from '../../domain/typo';

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
        @Inject('MonsterRepo')
        private readonly _monsterRepository: IMonsterRepository,

        @Inject('TypoRepo')
        private readonly _typoRepository: ITypoRepository,
    ) {}

    async execute(command: ReportTextTypoCommand): Promise<Typo | null> {
        const monster = await this._monsterRepository.getByCode(
            command.monsterCode,
            command.lang,
        );
        if (!monster) {
            return null;
        }

        // make sure the typo in inside monster's textes
        const monsterTextes = [
            monster.textes.description,
            monster.textes.name,
            monster.textes.quote?.author.firstname,
            monster.textes.quote?.author.lastname,
            monster.textes.quote?.text,
        ];
        const hasTypoBeenFound = monsterTextes
            .some(
                monsterText => monsterText.includes(command.content)
            );
        if (!hasTypoBeenFound) {
            return null;
        }

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
