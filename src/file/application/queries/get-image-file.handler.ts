import { Error } from '../../../application/error';
import {
    FileFolder,
    FileFormat,
    IFileService
} from '../file-service.interface';
import { Inject } from '@nestjs/common';
import {
    IQuery,
    IQueryHandler,
    QueryHandler
} from '@nestjs/cqrs';
import { ReadStream } from 'fs';
import { Result } from '../../../application/result';

export class GetImageFileQuery implements IQuery {
    constructor(
        readonly code: string,
        readonly folder: FileFolder,
        readonly format: FileFormat,
    ) {}
}

const FileService = () => Inject('FileService');

@QueryHandler(GetImageFileQuery)
export class GetImageFileHandler implements IQueryHandler<GetImageFileQuery> {
    constructor(
        @FileService()
        private readonly _fileService: IFileService,
    ) {}

    async execute(
        query: GetImageFileQuery
    ): Promise<Result<ReadStream> | Error> {
        const filePath = this._fileService.computeFilePath(
            query.folder,
            query.format,
            query.code,
        );

        return this._fileService.getFileStream(filePath);
    }
}