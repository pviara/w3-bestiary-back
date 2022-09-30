import { ApiProperty } from '@nestjs/swagger';
import { version } from '../../../package.json';

export class AppVersion {
    @ApiProperty({
        type: String
    })
    readonly content = version;
}
