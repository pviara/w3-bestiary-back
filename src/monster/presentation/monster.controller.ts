import { BadRequestException, Controller, Get, NotFoundException, Query } from '@nestjs/common';
import { GetAllMonstersQuery } from '../application/queries/get-all-monsters.handler';
import { Monster } from '../domain/monster';
import { QueryBus } from '@nestjs/cqrs';

@Controller()
export class MonsterController {
    constructor(private readonly _queryBus: QueryBus) {}
    
    @Get()
    async getAll(@Query('lang') lang: string) {
        if (!lang) {
            throw new BadRequestException('A language must be provided in query params.');
        }

        const query = new GetAllMonstersQuery(lang);
        const result = await this._queryBus.execute(query) as Monster[];
        if (result.length === 0) {
            throw new NotFoundException(`No monster was found for language "${lang}".`);
        }
        
        return result;
    }
}