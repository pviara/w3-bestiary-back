import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class ReportTextTypoPayload {
    @IsDefined()
    @IsString()
    @IsNotEmpty()
    lang: string;

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    monsterCode: string;

    @IsDefined()
    @IsString()
    @IsNotEmpty()
    typo: string;
}
