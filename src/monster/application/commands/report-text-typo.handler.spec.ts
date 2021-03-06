import { createMock } from 'ts-auto-mock';
import { Error } from '../../../application/error';
import { IMonsterRepository } from '../monster-repository.interface';
import { ITypoRepository } from '../../application/typo-repository.interface';
import { method, On } from 'ts-auto-mock/extension';
import { Monster } from '../../../monster/domain/monster';
import {
    ReportTextTypoCommand,
    ReportTextTypoHandler,
} from './report-text-typo.handler';
import { Result } from '../../../application/result';
import { Typo } from '../../../monster/domain/typo';
import { when } from 'jest-when';

describe('ReportTextTypoHandler', () => {
    let sut: ReportTextTypoHandler;

    let monsterRepositoryMock: IMonsterRepository;
    let typoRepositoryMock: ITypoRepository;
    let monsterRepoGetByCode: jest.Mock;
    let typoRepoFindByExactMatch: jest.Mock;

    beforeEach(() => {
        monsterRepositoryMock = createMock<IMonsterRepository>();
        typoRepositoryMock = createMock<ITypoRepository>();

        monsterRepoGetByCode = On(monsterRepositoryMock).get(
            method('getByCode'),
        );

        typoRepoFindByExactMatch = On(typoRepositoryMock).get(
            method('findByExactMatch'),
        );

        sut = new ReportTextTypoHandler(
            monsterRepositoryMock,
            typoRepositoryMock,
        );
    });

    describe('execute', () => {
        it('should call create on typoRepository with given arguments', async () => {
            const command = new ReportTextTypoCommand(
                'lang',
                'monsterCode',
                'typo',
            );

            const monsterMock = createMock<Monster>({
                textes: {
                    quote: {
                        author: {
                            firstname: '',
                            lastname: '',
                            title: '',
                        },
                        text: 'typo here',
                    },
                },
            });

            when(monsterRepoGetByCode)
                .calledWith(command.monsterCode, command.lang)
                .mockReturnValue(monsterMock);

            await sut.execute(command);

            expect(typoRepositoryMock.create).toBeCalledWith(command);
        });

        it('should return an error if no monster is found when calling getByCode on monsterRepository', async () => {
            const command = new ReportTextTypoCommand(
                'lang',
                'monsterCode',
                'typo',
            );

            when(monsterRepoGetByCode)
                .calledWith(command.monsterCode, command.lang)
                .mockReturnValue(undefined);

            const result = await sut.execute(command);

            expect(result).toBeInstanceOf(Error);
            expect(typoRepositoryMock.create).not.toBeCalled();
        });

        it('should return an error if no typo is found inside monster textes', async () => {
            const command = new ReportTextTypoCommand(
                'lang',
                'monsterCode',
                'typo',
            );

            const monsterMock = createMock<Monster>({
                textes: {
                    description: '',
                    name: '',
                    quote: {
                        author: {
                            firstname: '',
                            lastname: '',
                            title: '',
                        },
                        text: '',
                    },
                },
            });

            when(monsterRepoGetByCode)
                .calledWith(command.monsterCode, command.lang)
                .mockReturnValue(monsterMock);

            const result = await sut.execute(command);

            expect(result).toBeInstanceOf(Error);
            expect(typoRepositoryMock.create).not.toBeCalled();
        });

        it('should return an error if a similar typo already exists', async () => {
            const command = new ReportTextTypoCommand(
                'lang',
                'monsterCode',
                'typo',
            );

            const monsterMock = createMock<Monster>({
                textes: {
                    description: '',
                    name: '',
                    quote: {
                        author: {
                            firstname: '',
                            lastname: '',
                            title: '',
                        },
                        text: '',
                    },
                },
            });

            when(monsterRepoGetByCode)
                .calledWith(command.monsterCode, command.lang)
                .mockReturnValue(monsterMock);

            when(typoRepoFindByExactMatch)
                .calledWith(command.lang, command.monsterCode, command.content)
                .mockReturnValue([createMock<Typo>()]);

            const result = await sut.execute(command);

            expect(result).toBeInstanceOf(Error);
            expect(typoRepositoryMock.create).not.toBeCalled();
        });

        it('should return a typo result when calling create on typoRepository', async () => {
            const command = new ReportTextTypoCommand(
                'lang',
                'monsterCode',
                'typo',
            );

            const monsterMock = createMock<Monster>({
                textes: {
                    quote: {
                        author: {
                            firstname: '',
                            lastname: '',
                            title: '',
                        },
                        text: 'typo here',
                    },
                },
            });

            when(monsterRepoGetByCode)
                .calledWith(command.monsterCode, command.lang)
                .mockReturnValue(monsterMock);

            const result = await sut.execute(command);

            expect(result).toBeInstanceOf(Result);
            expect(typoRepositoryMock.create).toBeCalled();
        });
    });
});
