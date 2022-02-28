import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { Error } from '../../../application/error';
import { IMonsterRepository } from '../monster-repository.interface';
import { Inject } from '@nestjs/common';
import { ITypoRepository } from '../../application/typo-repository.interface';
import { MonsterTextes } from '../../../monster/domain/monster';
import { Result } from '../../../application/result';
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

    async execute(
        command: ReportTextTypoCommand,
    ): Promise<Result<Typo> | Error> {
        const monster = await this._monsterRepository.getByCode(
            command.monsterCode,
            command.lang,
        );
        if (!monster) {
            return new Error(
                404,
                `No monster was found with { code: '${command.monsterCode}', lang: '${command.lang}' }.`,
            );
        }

        // make sure the typo in inside monster's textes
        const hasTypoBeenFound = this._findTextInMonsterTextes(
            command.content.toLowerCase(),
            monster.textes,
        );
        if (!hasTypoBeenFound) {
            return new Error(
                404,
                `Typo "${command.content}" was not found with { code: '${command.monsterCode}', lang: '${command.lang}' }.`,
            );
        }

        const existingSimilarTypo = await this._typoRepository.findByExactMatch(
            command.lang,
            command.monsterCode,
            command.content,
        );
        if (existingSimilarTypo.length > 0) {
            return new Error(
                409,
                `A similar typo exists with { code: '${command.monsterCode}', lang: '${command.lang}', typo: '${command.content}' }.`,
            );
        }

        const created = await this._typoRepository.create(command);
        return new Result(created);
    }

    private _findTextInMonsterTextes(
        text: string,
        monsterTextes: MonsterTextes,
    ) {
        const assembledTextes = [
            monsterTextes.description.toLowerCase(),
            monsterTextes.name.toLowerCase(),
            monsterTextes.quote?.author.firstname.toLowerCase(),
            monsterTextes.quote?.author.lastname.toLowerCase(),
            monsterTextes.quote?.author.title.toLowerCase(),
            monsterTextes.quote?.text.toLowerCase(),
        ];

        return assembledTextes.some((monsterText) =>
            monsterText.includes(text),
        );
    }
}
