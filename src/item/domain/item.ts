import { ApiProperty } from '@nestjs/swagger';

export class Item {
    @ApiProperty()
    readonly code: string;

    @ApiProperty()
    readonly name: string;

    constructor(code: string, name: string) {
        this.code = code;
        this.name = name;
    }
}
