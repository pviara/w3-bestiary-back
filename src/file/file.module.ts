import { ConfigurationModule } from '../infrastructure/configuration/configuration.module';
import { Module } from '@nestjs/common';
import { FileServiceProvider } from './application/file-service.provider';

@Module({
    exports: [FileServiceProvider],
    imports: [ConfigurationModule],
    providers: [FileServiceProvider],
})
export class FileModule {}
