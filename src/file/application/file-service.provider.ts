import { FileServiceImplement } from './file-service.implement';
import { Provider } from '@nestjs/common';

export const FileServiceProvider: Provider = {
    provide: 'FileService',
    useClass: FileServiceImplement,
};