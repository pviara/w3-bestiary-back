import { createMock } from 'ts-auto-mock';
import { ITypoRepository } from '../../application/typo-repository.interface';
import {
    ReportTextTypoCommand,
    ReportTextTypoHandler,
} from './report-text-typo.handler';

describe('ReportTextTypoHandler', () => {
    let sut: ReportTextTypoHandler;

    let typoRepositoryMock: ITypoRepository;

    beforeEach(() => {
        typoRepositoryMock = createMock<ITypoRepository>();

        sut = new ReportTextTypoHandler(typoRepositoryMock);
    });

    describe('execute', () => {
        it('should call create on typoRepository with given arguments', async () => {
            const command = new ReportTextTypoCommand(
                'lang',
                'monsterCode',
                'content',
            );

            await sut.execute(command);

            expect(typoRepositoryMock.create).toBeCalledWith(command);
        });
    });
});
