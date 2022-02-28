import { HttpException } from '@nestjs/common';

export class Error {
    constructor(
        private readonly _code: number,
        private readonly _message: string,
    ) {}

    throw(): void {
        throw new HttpException(this._message, this._code);
    }
}
