import { IsDefined, IsString } from 'class-validator';

export class GetAllMonstersURLQuery {
    @IsDefined()
    @IsString()
    lang: string;
}