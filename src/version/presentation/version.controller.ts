import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AppVersion } from '../domain/version';
import { Controller, Get } from '@nestjs/common';

@ApiTags('version')
@Controller()
export class VersionController {
    @ApiOperation({
        description: 'Get project version.'
    })
    @ApiOkResponse({
        description: 'Retrieved project version.',
        type: AppVersion,
    })
    @Get()
    getProjectVersion(): AppVersion {
        return new AppVersion();
    }
}
