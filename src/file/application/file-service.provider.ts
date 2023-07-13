import { FileServiceImplement } from './file-service.implement';
import { Provider } from '@nestjs/common';

export const FILE_SERVICE_TOKEN = 'FileService';

export const FileServiceProvider: Provider = {
    provide: FILE_SERVICE_TOKEN,
    useClass: FileServiceImplement,
};
