import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class GetItemThumbnailURLQuery {
    @ApiProperty({
        required: true,
    })
    @IsDefined()
    @IsString()
    code: string;
}
