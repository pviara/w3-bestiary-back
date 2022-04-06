import { Module } from '@nestjs/common';
import { VersionController } from './presentation/version.controller';

@Module({
    controllers: [VersionController],
    exports: [],
    imports: [],
    providers: [],
})
export class VersionModule {}