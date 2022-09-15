import { createMock } from 'ts-auto-mock';
import {
    FileFolder,
    FileFormat,
    IFileService,
} from '../../../file/application/file-service.interface';
import {
    GetImageFileHandler,
    GetImageFileQuery,
} from './get-image-file.handler';
import { method, On } from 'ts-auto-mock/extension';
import { when } from 'jest-when';

describe('GetImageFileQuery', () => {
    let sut: GetImageFileHandler;

    let fileServiceMock: IFileService;

    beforeEach(() => {
        fileServiceMock = createMock<IFileService>();

        sut = new GetImageFileHandler(fileServiceMock);
    });

    describe('execute', () => {
        it('should call getFile on fileService with given argument', async () => {
            const query = new GetImageFileQuery(
                'code',
                FileFolder.MonsterImages,
                FileFormat.PNG,
            );

            const filePathMock = `someSortOfPathFor${query.code}`;

            const fileServiceComputeFilePathMock = On(fileServiceMock).get(
                method('computeFilePath'),
            );
            when(fileServiceComputeFilePathMock)
                .calledWith(query.folder, query.format, query.code)
                .mockReturnValue(filePathMock);

            await sut.execute(query);

            expect(fileServiceMock.getFileStream).toBeCalledWith(filePathMock);
        });
    });
});
