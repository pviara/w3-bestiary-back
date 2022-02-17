import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { IMonsterRepository } from '../monster-repository.interface';
import { Inject } from '@nestjs/common';
import { ITypoRepository } from '../../application/typo-repository.interface';
import { Typo } from '../../domain/typo';
import { MonsterTextes } from 'src/monster/domain/monster';

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
        const hasTypoBeenFound = this._findTextInMonsterTextes(
            command.content,
            monster.textes,
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

    private _findTextInMonsterTextes(
        text: string,
        monsterTextes: MonsterTextes,
    ) {
        const assembledTextes = [
            monsterTextes.description,
            monsterTextes.name,
            monsterTextes.quote?.author.firstname,
            monsterTextes.quote?.author.lastname,
            monsterTextes.quote?.author.title,
            monsterTextes.quote?.text,
        ];

        return assembledTextes.some((monsterText) =>
            monsterText.includes(text),
        );
    }
}
