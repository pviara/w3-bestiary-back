import { BadRequestException, Controller, Get, Inject, Query } from '@nestjs/common';
import { IMonsterRepository } from '../application/monster-repository.interface';

@Controller()
export class MonsterController {
    constructor(
        @Inject('MonsterRepo')
        private readonly _monsterRepository: IMonsterRepository
    ) {}
    
    @Get()
    async getAll(@Query('lang') lang: string) {
        if (!lang) {
            throw new BadRequestException('A language must be provided in query params.');
        }
        return await this._monsterRepository.getAll(lang);
    }
}