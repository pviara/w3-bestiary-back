import { createMock } from 'ts-auto-mock';
import { IMonsterRepository } from '../monster-repository.interface';
import { ITypoRepository } from '../../application/typo-repository.interface';
import { method, On } from 'ts-auto-mock/extension';
import {
    ReportTextTypoCommand,
    ReportTextTypoHandler,
} from './report-text-typo.handler';
import { when } from 'jest-when';

describe('ReportTextTypoHandler', () => {
    let sut: ReportTextTypoHandler;

    const command = new ReportTextTypoCommand('lang', 'monsterCode', 'typo');

    let monsterRepositoryMock: IMonsterRepository;
    let typoRepositoryMock: ITypoRepository;

    const monsterMock = {
        category: '',
        code: command.monsterCode,
        textes: {
            description: '',
            name: '',
            quote: {
                author: {
                    firstname: '',
                    lastname: '',
                    title: '',
                },
                text: 'typo here',
            },
        },
        weakspots: {
            bombs: [],
            oils: [],
            potions: [],
            signs: [],
        },
    };

    beforeEach(() => {
        monsterRepositoryMock = createMock<IMonsterRepository>();
        typoRepositoryMock = createMock<ITypoRepository>();

        const monsterGetByCode = On(monsterRepositoryMock).get(
            method('getByCode'),
        );
        when(monsterGetByCode)
            .calledWith(command.monsterCode, command.lang)
            .mockReturnValue(monsterMock);

        sut = new ReportTextTypoHandler(
            monsterRepositoryMock,
            typoRepositoryMock,
        );
    });

    describe('execute', () => {
        it('should call create on typoRepository with given arguments', async () => {
            await sut.execute(command);

            expect(typoRepositoryMock.create).toBeCalledWith(command);
        });
    });
});
