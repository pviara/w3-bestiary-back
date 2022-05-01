import { Error } from '../../../application/error';
import {
    FileFolder,
    FileFormat,
    IFileService,
} from '../../../file/application/file-service.interface';
import { Inject } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ReadStream } from 'fs';
import { Result } from '../../../application/result';

export class GetItemThumbnailQuery implements IQuery {
    constructor(readonly code: string, readonly folder: FileFolder) {}
}

const FileService = () => Inject('FileService');

@QueryHandler(GetItemThumbnailQuery)
export class GetItemThumbnailHandler
    implements IQueryHandler<GetItemThumbnailQuery>
{
    constructor(
        @FileService()
        private readonly _fileService: IFileService,
    ) {}

    async execute(
        query: GetItemThumbnailQuery,
    ): Promise<Result<ReadStream> | Error> {
        const filePath = this._fileService.computeFilePath(
            query.folder,
            FileFormat.PNG,
            query.code,
        );

        return this._fileService.getFileStream(filePath);
    }
}
