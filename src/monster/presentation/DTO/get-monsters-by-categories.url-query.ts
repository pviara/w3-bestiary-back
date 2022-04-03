import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsString } from 'class-validator';

export class GetMonstersByCategoriesURLQuery {
    @ApiProperty({
        required: true,
    })
    @IsDefined()
    @IsString()
    lang: string;
}
