import {
    Body,
    ConflictException,
    Controller,
    Post,
    ValidationPipe,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ReportTextTypoCommand } from '../application/commands/report-text-typo.handler';
import { ReportTextTypoPayload } from './DTO/report-text-typo.payload';
import { Typo } from '../domain/typo';

@Controller()
export class TypoController {
    constructor(private readonly commandBus: CommandBus) {}

    @Post()
    async reportTextTypo(
        @Body(new ValidationPipe()) payload: ReportTextTypoPayload,
    ): Promise<Typo> {
        const command = new ReportTextTypoCommand(
            payload.lang,
            payload.monsterCode,
            payload.typo,
        );

        const result = await this.commandBus.execute<
            ReportTextTypoCommand,
            Typo
        >(command);
        if (!result) {
            throw new ConflictException(
                `A typo with a similar content for monster "${command.monsterCode}" in lang "${command.lang}" has already been reported.`,
            );
        }
        return result;
    }
}
