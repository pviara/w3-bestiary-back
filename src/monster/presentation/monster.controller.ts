import { BadRequestException, Controller, Get, NotFoundException, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetAllMonstersQuery } from '../application/queries/get-all-monsters.query';

@Controller()
export class MonsterController {
    constructor(private readonly _queryBus: QueryBus) {}
    
    @Get()
    async getAll(@Query('lang') lang: string) {
        if (!lang) {
            throw new BadRequestException('A language must be provided in query params.');
        }

        const query = new GetAllMonstersQuery(lang);
        const result = await this._queryBus.execute(query);
        if (!result) {
            throw new NotFoundException('No monster was found');
        }
        
        return result;
    }
}