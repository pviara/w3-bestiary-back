import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class GetAllItemsURLQuery {
    @ApiProperty({
        required: true,
    })
    @IsDefined()
    @IsString()
    lang: string;
}
