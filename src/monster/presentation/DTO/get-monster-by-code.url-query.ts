import { IsDefined, IsString } from 'class-validator';

export class GetMonsterByCodeURLQuery {
    @IsDefined()
    @IsString()
    code: string;

    @IsDefined()
    @IsString()
    lang: string;
}
