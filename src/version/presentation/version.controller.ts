import { Controller, Get } from '@nestjs/common';
import { version } from '../../../package.json'

@Controller()
export class VersionController {
    @Get()
    getProjectVersion(): string {
        return version;
    }
}