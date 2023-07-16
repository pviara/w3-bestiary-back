import { Error } from '../../../application/error';
import { FileFolder, FileFormat, FileService } from '../file-service.interface';
import { FILE_SERVICE_TOKEN } from '../file-service.provider';
import { Inject } from '@nestjs/common';
import { IQuery, IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ReadStream } from 'fs';
import { Result } from '../../../application/result';

export class GetImageFileQuery implements IQuery {
    constructor(
        readonly code: string,
        readonly folder: FileFolder,
        readonly format: FileFormat,
    ) {}
}

@QueryHandler(GetImageFileQuery)
export class GetImageFileHandler implements IQueryHandler<GetImageFileQuery> {
    constructor(
        @Inject(FILE_SERVICE_TOKEN)
        private readonly fileService: FileService,
    ) {}

    async execute(
        query: GetImageFileQuery,
    ): Promise<Result<ReadStream> | Error> {
        const filePath = this.fileService.computeFilePath(
            query.folder,
            query.format,
            query.code,
        );

        return this.fileService.getFileStream(filePath);
    }
}
