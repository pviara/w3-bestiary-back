import { Error } from '../../application/error';
import { ReadStream } from 'fs';
import { Result } from '../../application/result';

export enum FileFolder {
    ItemThumbnails = 'item/thumbnails',
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
