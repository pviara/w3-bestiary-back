import { AnyKeys, Model } from 'mongoose';
import { CategoryEntity } from '../../../../category/persistence/category-entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
    Monster,
    MonsterTextes,
    MonsterTextesQuote,
    MonsterTextesQuoteAuthor,
    MonsterWeakspots,
} from '../../../domain/monster';
import { MonsterEntity } from '../../../persistence/entities/monster-entity';
import { MonsterMapper } from '../../../../utils/mappers/monster.mapper';
import { MonsterRepositoryImplement } from '../../../persistence/repositories/monster-repository.implement';
import { TestHelper } from '../../../../utils/test-helper';

@Injectable()
export class MonsterTestingRepositoryImplement extends MonsterRepositoryImplement {
    private _testCategoryName = 'test_category';

    constructor(
        @InjectModel('Category')
        private readonly categoryModel: Model<CategoryEntity>,

        @InjectModel('Monster')
        readonly monsterModel: Model<MonsterEntity>,
    ) {
        super(monsterModel);
    }

    async createTestingValues(lang: string): Promise<Monster[]> {
        await this._createTestingCategory(lang);

        for (const monster of this._generateMonsters()) {
            await this.monsterModel.create<AnyKeys<MonsterEntity>>({
                category: monster.category,
                code: monster.code,
                textes: [
                    {
                        lang,
                        name: monster.textes.name,
                        description: monster.textes.description,
                        quote: {
                            author: {
                                firstname:
                                    monster.textes.quote?.author.firstname,
                                lastname: monster.textes.quote?.author.lastname,
                                title: monster.textes.quote?.author.title,
                            },
                            text: monster.textes.quote?.text,
                        },
                    },
                ],
                weakspots: monster.weakspots,
            });
        }

        const created = await this.monsterModel.find({});
        return MonsterMapper.toMonsters(created);
    }

    async deleteTestingValues(): Promise<void> {
        await this.monsterModel.deleteMany();
        await this._deleteTestingCategory();
    }

    private async _createTestingCategory(lang: string): Promise<void> {
        await this.categoryModel.create<AnyKeys<CategoryEntity>>({
            code: this._testCategoryName,
            names: [
                {
                    lang,
                    name: 'category',
                },
            ],
        });
    }

    private async _deleteTestingCategory(): Promise<void> {
        await this.categoryModel.deleteMany();
    }

    private _generateMonsters(): Monster[] {
        const monsters: Monster[] = [];

        for (let i = 0; i < 15; i++) {
            monsters.push(
                new Monster(
                    this._testCategoryName,
                    `test_${TestHelper.generateString(5)}`,
                    new MonsterTextes(
                        'description',
                        TestHelper.generateString(5),
                        new MonsterTextesQuote(
                            new MonsterTextesQuoteAuthor(
                                'firstname',
                                'lastname',
                                'title',
                            ),
                            'quote',
                        ),
                    ),
                    new MonsterWeakspots([], [], [], []),
                ),
            );
        }

        return monsters;
    }
}
