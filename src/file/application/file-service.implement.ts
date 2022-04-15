import { ConfigurationService } from 'src/infrastructure/configuration/configuration.service';
import { Error } from '../../application/error';
import { FileFolder, FileFormat, IFileService } from './file-service.interface';
import { Injectable } from '@nestjs/common';
import { createReadStream, existsSync, ReadStream } from 'fs';
import { Result } from '../../application/result';

@Injectable()
export class FileServiceImplement implements IFileService {
    constructor(private readonly _configService: ConfigurationService) {}
    
    computeFilePath(folder: FileFolder, format: FileFormat, code: string): string {
        const { FILES_PATH } = this._configService.file;
        return `${FILES_PATH}/${folder}/${code}${format}`;
    }

    getFileStream(path: string): Result<ReadStream> | Error {
        if (!existsSync(path)) {
            return new Error(404, `No file was found with path "${path}".`);
        }

        return new Result(createReadStream(path));
    }
}