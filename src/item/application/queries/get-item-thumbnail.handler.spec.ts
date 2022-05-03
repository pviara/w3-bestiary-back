import { createMock } from 'ts-auto-mock';
import {
    FileFolder,
    FileFormat,
    IFileService
} from '../../../file/application/file-service.interface';
import {
    GetItemThumbnailHandler,
    GetItemThumbnailQuery
} from './get-item-thumbnail.handler';
import { method, On } from 'ts-auto-mock/extension';
import { when } from 'jest-when';

describe('GetItemThumbnailHandler', () => {
    let sut: GetItemThumbnailHandler;

    let fileServiceMock: IFileService;

    beforeEach(() => {
        fileServiceMock = createMock<IFileService>();

        sut = new GetItemThumbnailHandler(fileServiceMock);
    });

    describe('execute', () => {
        it('should call getFile on fileService with given argument', async () => {
            const command = new GetItemThumbnailQuery(
                'code',
                FileFolder.ItemThumbnails,
            );

            const filePathMock = `someSortOfPathFor${command.code}`;

            const fileServiceComputeFilePathMock = On(fileServiceMock).get(
                method('computeFilePath'),
            );
            when(fileServiceComputeFilePathMock)
                .calledWith(
                    FileFolder.ItemThumbnails,
                    FileFormat.PNG,
                    command.code,
                )
                .mockReturnValue(filePathMock);

            await sut.execute(command);

            expect(fileServiceMock.getFileStream).toBeCalledWith(filePathMock);
        });
    });
});