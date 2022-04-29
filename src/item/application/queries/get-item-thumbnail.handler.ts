import { FileFolder } from 'src/file/application/file-service.interface';
import { IQuery } from '@nestjs/cqrs';

export class GetItemThumbnailQuery implements IQuery {
    constructor(
        readonly code: string,
        readonly folder: FileFolder,
    ) {}
}