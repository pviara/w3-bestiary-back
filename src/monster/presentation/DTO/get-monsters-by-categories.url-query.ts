import { IsDefined, IsString } from 'class-validator';

export class GetMonstersByCategoriesURLQuery {
    @IsDefined()
    @IsString()
    lang: string;
}