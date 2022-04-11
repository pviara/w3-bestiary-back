import { ApiExcludeController } from '@nestjs/swagger';
import { AppVersion } from '../domain/version';
import { Controller, Get } from '@nestjs/common';

@ApiExcludeController()
@Controller()
export class VersionController {
    @Get()
    getProjectVersion(): AppVersion {
        return new AppVersion();
    }
}