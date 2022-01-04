import { IMonsterRepository } from '../application/monster-repository.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Monster } from '../domain/monster';
import { MonsterEntity } from './monster-entity';
import { MonsterMapper } from '../../utils/mappers/monster.mapper';

@Injectable()
export class MonsterRepositoryImplement implements IMonsterRepository {
    constructor(
        @InjectModel('Monster')
        private readonly _model: Model<MonsterEntity>
    ) {}

    async getAll(lang: string): Promise<Monster[]> {
        const monstersAggregate = [{
            $match: {},
        },
        {
            $project: {
                code: 1,
                textes: {
                    $filter: {
                        input: '$textes',
                        as: 'textes',
                        cond: {
                            $eq: [
                                '$$textes.lang',
                                lang
                            ]
                        }
                    }
                },
                weakspots: 1
            }
        }];
        const monsters = await this
            ._model
            .aggregate<MonsterEntity>(monstersAggregate)
            .exec();
        
        return MonsterMapper.toDomainModels(monsters);
    }
}
