import { CategoryFileService } from './category-file-service.interface';
import { CategoryJsonEntity } from '../../category/persistence/category-json-entity';
import { ConfigurationService } from '../../infrastructure/configuration/configuration.service';
import { createReadStream, existsSync, readFileSync, ReadStream } from 'fs';
import { Error as AppError } from '../../application/error';
import { FileFolder, FileFormat, FileService } from './file-service.interface';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ItemFileService } from './item-file-service.interface';
import { ItemJsonEntity } from '../../item/persistence/item-json-entity';
import { MonsterFileService } from './monster-file-service.interface';
import { Result } from '../../application/result';
import * as path from 'path';
import { MonsterJsonEntity } from 'src/monster/persistence/entities/monster-json-entity';

@Injectable()
export class FileServiceImplement
    implements
        FileService,
        CategoryFileService,
        ItemFileService,
        MonsterFileService
{
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
        const result = readFileSync(this.getItemsJsonFilePath());
        return JSON.parse(result.toString());
    }

    getAllMonsterCategoriesFromJsonFile(): CategoryJsonEntity[] {
        const result = readFileSync(this.getMonsterCategoriesJsonFilePath());
        return JSON.parse(result.toString());
    }

    getAllMonsterFromJsonFile(): MonsterJsonEntity[] {
        const result = readFileSync(this.getMonstersJsonFilePath());
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

    private getItemsJsonFilePath(): string {
        if (this._configService.application.environment === 'TEST') {
            return path.join(__dirname, '../../../src/static/items.json');
        }

        return path.join(__dirname, '../../../static/items.json');
    }

    private getMonsterCategoriesJsonFilePath(): string {
        if (this._configService.application.environment === 'TEST') {
            return path.join(__dirname, '../../../src/static/categories.json');
        }

        return path.join(__dirname, '../../../static/categories.json');
    }

    private getMonstersJsonFilePath(): string {
        if (this._configService.application.environment === 'TEST') {
            return path.join(__dirname, '../../../src/static/monsters.json');
        }

        return path.join(__dirname, '../../../static/monsters.json');
    }
}
