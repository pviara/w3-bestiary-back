import { Error } from 'src/application/error';
import { ReadStream } from 'fs';
import { Result } from 'src/application/result';

export enum FileFolder {
    MonsterImages = 'monster/images',
    MonsterThumbnails = 'monster/thumbnails',
}

export enum FileFormat {
    PNG = '.png',
}

export interface IFileService {
    computeFilePath(
        folder: FileFolder,
        format: FileFormat,
        code: string,
    ): string;
    getFileStream(path: string): Result<ReadStream> | Error;
}
