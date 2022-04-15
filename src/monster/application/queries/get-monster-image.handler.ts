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

export class GetMonsterImageQuery implements IQuery {
    constructor(readonly code: string) {}
}

const FileService = () => Inject('FileService');

@QueryHandler(GetMonsterImageQuery)
export class GetMonsterImageHandler
    implements IQueryHandler<GetMonsterImageQuery>
{
    constructor(
        @FileService()
        private readonly _fileService: IFileService,
    ) {}

    async execute(query: GetMonsterImageQuery): Promise<Result<ReadStream> | Error> {
        const filePath = this._fileService.computeFilePath(
            FileFolder.MonsterImages,
            FileFormat.PNG,
            query.code,
        );
        
        return this._fileService.getFileStream(filePath);
    }
}
