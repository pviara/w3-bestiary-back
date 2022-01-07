import { IMonsterRepository } from '../application/monster-repository.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { Monster, MonstersByCategory } from '../domain/monster';
import { MonsterMapper } from '../../utils/mappers/monster.mapper';
import { MonstersByCategoryEntity, MonsterEntity } from './monster-entity';

type MonsterEntitiesByLang = {
    lang: string;
    monsters: MonsterEntity[];
};

type MonstersByCategoriesEntitiesByLang = {
    lang: string;
    monsters: MonstersByCategoryEntity[];
};

@Injectable()
export class MonsterRepositoryImplement implements IMonsterRepository {
    private _cachedMonstersByLang: MonsterEntitiesByLang[] = [];
    private _cachedMonstersByCategoryByLang: MonstersByCategoriesEntitiesByLang[] = [];
    
    constructor(
        @InjectModel('Monster')
        private readonly _model: Model<MonsterEntity>
    ) {}

    async getMonstersByCategories(lang: string): Promise<MonstersByCategory[]> {
        const cached = this._getMonstersByCategoryFromCache(lang);
        if (cached) {
            return MonsterMapper.toMonstersByCategories(cached);
        }
        
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

        this._addMonstersByCategoryInCache(lang, monstersByCategoryEntities);
        
        return MonsterMapper.toMonstersByCategories(monstersByCategoryEntities);
    }

    async getByCode(code: string, lang: string): Promise<Monster | null> {
        const cached = this._getMonsterFromCache(code, lang);
        if (cached) {
            return MonsterMapper.toMonster(cached);
        }
        
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
            this._addMonsterInCache(lang, monsterEntity);
            return MonsterMapper.toMonster(monsterEntity);
        }
    }
    
    private _addMonsterInCache(lang: string, monsterEntity: MonsterEntity): void {
        const existingLang = this
            ._cachedMonstersByLang
            .find(
                cachedMonstersByLang => cachedMonstersByLang.lang === lang
            );
        if (existingLang) {
            existingLang
                .monsters
                .push(monsterEntity);
            return;
        }

        this._cachedMonstersByLang.push({
            lang,
            monsters: [monsterEntity]
        });
    }

    private _addMonstersByCategoryInCache(lang: string, monstersByCategoryEntities: MonstersByCategoryEntity[]): void {
        this._cachedMonstersByCategoryByLang.push({
            lang,
            monsters: monstersByCategoryEntities
        });
    }

    private _getMonsterFromCache(code: string, lang: string): MonsterEntity {
        for (const cached of this._cachedMonstersByLang) {
            if (cached.lang !== lang) {
                continue;
            }
            const matchingMonsterIndex = cached
                .monsters
                .findIndex(
                    monster => monster.code === code
                );
            if (matchingMonsterIndex >= 0) {
                return cached.monsters[matchingMonsterIndex];
            }
        }
    }

    private _getMonstersByCategoryFromCache(lang: string): MonstersByCategoryEntity[] {
        const cached = this
            ._cachedMonstersByCategoryByLang
            .find(
                cached => cached.lang === lang
            );
        if (cached?.monsters.length > 0) {
            return cached.monsters;
        }
    }
}
