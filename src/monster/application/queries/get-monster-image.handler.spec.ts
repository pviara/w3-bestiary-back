import { createMock } from 'ts-auto-mock';
import {
    FileFolder,
    FileFormat,
    IFileService,
} from '../../../file/application/file-service.interface';
import {
    GetMonsterImageHandler,
    GetMonsterImageQuery,
} from './get-monster-image.handler';
import { method, On } from 'ts-auto-mock/extension';
import { when } from 'jest-when';

describe('GetMonsterImageHandler', () => {
    let sut: GetMonsterImageHandler;

    let fileServiceMock: IFileService;

    beforeEach(() => {
        fileServiceMock = createMock<IFileService>();

        sut = new GetMonsterImageHandler(fileServiceMock);
    });

    describe('execute', () => {
        it('should call getFile on fileService with given argument', async () => {
            const command = new GetMonsterImageQuery(
                'code',
                FileFolder.MonsterImages,
            );

            const filePathMock = `someSortOfPathFor${command.code}`;

            const fileServiceComputeFilePathMock = On(fileServiceMock).get(
                method('computeFilePath'),
            );
            when(fileServiceComputeFilePathMock)
                .calledWith(
                    FileFolder.MonsterImages,
                    FileFormat.PNG,
                    command.code,
                )
                .mockReturnValue(filePathMock);

            await sut.execute(command);

            expect(fileServiceMock.getFileStream).toBeCalledWith(filePathMock);
        });
    });
});
