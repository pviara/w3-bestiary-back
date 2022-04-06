import { Controller, Get } from '@nestjs/common';
import { version } from '../../../package.json'
import { Version } from '../domain/version';

@Controller()
export class VersionController {
    @Get()
    getProjectVersion(): Version {
        return new Version(version);
    }
}