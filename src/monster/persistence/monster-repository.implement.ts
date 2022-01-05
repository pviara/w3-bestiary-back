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

        // check if at least one document has been found using the textes $filter
        if (monsters[0].textes.length === 0) {
            return [];
        }
        
        return MonsterMapper.toDomainModels(monsters)
    }

    async getByCode(code: string, lang: string): Promise<Monster | null> {
        const monstersAggregate = [{
            $match: {
                code
            }
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

        const [monster] = await this
            ._model
            .aggregate<MonsterEntity>(monstersAggregate)
            .exec();

        if (monster.textes.length === 0) {
            return null;
        }

        return MonsterMapper.toDomainModel(monster);
    }
}
