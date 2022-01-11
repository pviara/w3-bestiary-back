import { IsDefined, IsString } from 'class-validator';

export class GetAllItemsURLQuery {
    @IsDefined()
    @IsString()
    lang: string;
}
