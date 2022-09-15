import { ConfigurationModule } from '../infrastructure/configuration/configuration.module';
import { CqrsModule } from '@nestjs/cqrs';
import { FileServiceProvider } from './application/file-service.provider';
import { GetImageFileHandler } from './application/queries/get-image-file.handler';
import { Module } from '@nestjs/common';

const queryHandlers = [GetImageFileHandler];

@Module({
    exports: [FileServiceProvider],
    imports: [ConfigurationModule, CqrsModule],
    providers: [FileServiceProvider, ...queryHandlers],
})
export class FileModule {}
