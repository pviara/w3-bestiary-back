import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class GetMonsterImageURLQuery {
    @ApiProperty({
        required: true,
    })
    @IsDefined()
    @IsString()
    code: string;
}
