import { IMonsterRepository } from '../application/monster-repository.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { Monster, MonstersByCategory } from '../domain/monster';
import { MonsterMapper } from '../../utils/mappers/monster.mapper';
import { MonstersByCategoryEntity, MonsterEntity } from './monster-entity';

@Injectable()
export class MonsterRepositoryImplement implements IMonsterRepository {
    constructor(
        @InjectModel('Monster')
        private readonly _model: Model<MonsterEntity>
    ) {}

    async getMonstersByCategories(lang: string): Promise<MonstersByCategory[]> {
        const aggregate: PipelineStage[] = [{
            $project: {
                category: 1,
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
        },
        {
            $sort: {
                'textes.name': 1
            }
        },
        {
            $group: {
                _id: '$category',
                monsters: {
                    $push: '$$ROOT'
                }
            }
        },
        {
            $lookup: {
                from: 'categories',
                localField: '_id',
                foreignField: 'code',
                as: 'categories'
            }
        },
        {
            $unwind: {
                path: '$categories'
            }
        },
        {
            $project: {
                category: {
                    code: '$categories.code',
                    textes: {
                        $filter: {
                            input: '$categories.names',
                            as: 'categoryNames',
                            cond: {
                                $eq: [
                                    '$$categoryNames.lang',
                                    lang
                                ]
                            }
                        }
                    }
                },
                monsters: 1
            }
        },
        {
            $sort: {
                'category.textes.name': 1,
            }
        }];

        const monstersByCategoryEntities = await this
            ._model
            .aggregate<MonstersByCategoryEntity>(aggregate)
            .exec();
        
        // check that all monsters' textes have been found with the given language
        const haveAllMonstersTextesBeenFound = monstersByCategoryEntities
            .every(
                monsterByCategoryEntity => monsterByCategoryEntity
                    .monsters
                    .every(
                        monsterEntity => monsterEntity.textes.length > 0
                    )
            );
        if (!haveAllMonstersTextesBeenFound) {
            return [];
        }
        
        return MonsterMapper.toMonstersByCategories(monstersByCategoryEntities);
    }

    async getByCode(code: string, lang: string): Promise<Monster | null> {
        const aggregate: PipelineStage[] = [{
            $match: {
                code
            }
        },
        {
            $project: {
                category: 1,
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

        const [monsterEntity] = await this
            ._model
            .aggregate<MonsterEntity>(aggregate)
            .exec();

        if (monsterEntity && monsterEntity.textes.length > 0) {
            return MonsterMapper.toMonster(monsterEntity);
        }
    }
}
