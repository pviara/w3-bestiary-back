import { IsDefined, IsString } from 'class-validator';

export class GetAllCategoriesURLQuery {
    @IsDefined()
    @IsString()
    lang: string;
}
