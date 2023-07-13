import { ConfigurationService } from '../../infrastructure/configuration/configuration.service';
import {
    createReadStream,
    existsSync,
    openSync,
    readFileSync,
    ReadStream,
} from 'fs';
import { Error as AppError } from '../../application/error';
import { FileFolder, FileFormat, FileService } from './file-service.interface';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ItemFileService } from './item-file-service.interface';
import { Result } from '../../application/result';
import { ItemJsonEntity } from 'src/item/persistence/item-json-entity';
import * as path from 'path';

@Injectable()
export class FileServiceImplement implements FileService, ItemFileService {
    private readonly itemsJsonFilePath = path.join(
        __dirname,
        '../../../dist/static/items.json',
    );

    constructor(private readonly _configService: ConfigurationService) {}

    computeFilePath(
        folder: FileFolder,
        format: FileFormat,
        code: string,
    ): string {
        const { FILES_PATH } = this._configService.file;
        return `${FILES_PATH}/${folder}/${code}${format}`;
    }

    getAllItemsFromJsonFile(): ItemJsonEntity[] {
        const result = readFileSync(this.itemsJsonFilePath);
        return JSON.parse(result.toString());
    }

    getFileStream(path: string): Result<ReadStream> | AppError {
        if (!existsSync(path)) {
            return new AppError(
                HttpStatus.NOT_FOUND,
                `No file was found with path "${path}".`,
            );
        }

        return new Result(createReadStream(path));
    }
}
