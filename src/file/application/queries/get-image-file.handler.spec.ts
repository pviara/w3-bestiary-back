import {
    FileFolder,
    FileFormat,
} from '../../../file/application/file-service.interface';
import {
    FileServiceSpy,
    stubComputeFilePath,
} from '../../../../test/doubles/file-service.spy';
import {
    GetImageFileHandler,
    GetImageFileQuery,
} from './get-image-file.handler';

describe('GetImageFileQuery', () => {
    let sut: GetImageFileHandler;

    let fileService: FileServiceSpy;

    beforeEach(() => {
        fileService = new FileServiceSpy();

        sut = new GetImageFileHandler(fileService);
    });

    describe('execute', () => {
        it('should call getFile on fileService with given argument', async () => {
            const query = new GetImageFileQuery(
                'code',
                FileFolder.MonsterImages,
                FileFormat.PNG,
            );

            const dummyFilePath = `someSortOfPathFor${query.code}`;
            stubComputeFilePath(fileService, dummyFilePath);

            await sut.execute(query);

            expect(fileService.calls.getFileStream.history).toContain(
                dummyFilePath,
            );
        });
    });
});
