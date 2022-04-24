import { ConfigurationModule } from '../infrastructure/configuration/configuration.module';
import { FileServiceProvider } from './application/file-service.provider';
import { Module } from '@nestjs/common';

@Module({
    exports: [FileServiceProvider],
    imports: [ConfigurationModule],
    providers: [FileServiceProvider],
})
export class FileModule {}
