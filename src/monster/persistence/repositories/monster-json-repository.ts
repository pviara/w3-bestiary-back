import { Error } from '../../../application/error';
import { FILE_SERVICE_TOKEN } from '../../../file/application/file-service.provider';
import { HttpStatus, Inject, NotImplementedException } from '@nestjs/common';
import { MonsterFileService } from '../../../file/application/monster-file-service.interface';
import { MonsterRepository } from '../../application/monster-repository.interface';
import {
    MonstersByCategory,
    Monster,
    MonstersByCategoryCategory,
    MonsterForCategory,
    MonsterWeakspots,
} from '../../domain/monster';
import { Result } from '../../../application/result';
import {
    CategoryJsonEntity,
    CategoryName,
} from 'src/category/persistence/category-json-entity';
import {
    MonsterJsonEntity,
    MonsterTextesEntity,
} from '../entities/monster-json-entity';

export class MonsterJsonRepository implements MonsterRepository {
    constructor(
        @Inject(FILE_SERVICE_TOKEN)
        private readonly fileService: MonsterFileService,
    ) {}

    getByCode(code: string, lang: string): Result<Monster> | Error {
        const monsterEntities = this.fileService.getAllMonsterFromJsonFile();
        const monsterEntity = this.getMonsterEntityByCode(
            monsterEntities,
            code,
        );
        if (!monsterEntity) {
            return new Error(
                HttpStatus.NOT_FOUND,
                `Given code "${code}" didn't match any monster.`,
            );
        }

        const monsterTextes = this.getMonsterEntityTextesByLang(
            monsterEntity,
            lang,
        );
        if (!monsterTextes) {
            return new Error(
                HttpStatus.NOT_FOUND,
                `Given lang "${lang}" didn't match at least one monster's name language.`,
            );
        }

        return new Result(
            new Monster(
                monsterEntity.category,
                monsterEntity.code,
                monsterTextes,
                monsterEntity.weakspots,
                monsterEntity.extension,
            ),
        );
    }

    getMonstersByCategories(
        lang: string,
    ): Result<MonstersByCategory[]> | Error {
        const [categoryEntities, monsterEntities] = [
            this.fileService.getAllMonsterCategoriesFromJsonFile(),
            this.fileService.getAllMonsterFromJsonFile(),
        ];

        const monstersByCategory = categoryEntities.map<MonstersByCategory>(
            (categoryEntity) => {
                const categoryName = this.getCategoryNameByLang(
                    categoryEntity,
                    lang,
                );

                if (categoryName) {
                    const filteredMonsterEntities =
                        this.filterMonsterEntitiesByCategory(
                            monsterEntities,
                            categoryEntity,
                        );

                    const monstersForCategory =
                        this.mapMonsterEntitiesToMonsterByCategory(
                            filteredMonsterEntities,
                            lang,
                        );

                    const monstersByCategoryCategory =
                        new MonstersByCategoryCategory(
                            categoryEntity.code,
                            categoryName.name,
                        );

                    const monstersByCategory = new MonstersByCategory(
                        monstersByCategoryCategory,
                        monstersForCategory,
                    );

                    return monstersByCategory;
                }
            },
        );

        if (monstersByCategory.includes(undefined)) {
            return new Error(
                HttpStatus.NOT_FOUND,
                `Given lang "${lang}" didn't match at least one category's name language.`,
            );
        }

        const sortedMonstersByCategory =
            this.sortMonstersByCategoryAlphabetically(monstersByCategory);

        return new Result(sortedMonstersByCategory);
    }

    private getMonsterEntityByCode(
        monsterEntities: MonsterJsonEntity[],
        code: string,
    ): MonsterJsonEntity {
        return monsterEntities.find(
            (monsterEntity) => monsterEntity.code === code,
        );
    }

    private getMonsterEntityTextesByLang(
        monsterEntity: MonsterJsonEntity,
        lang: string,
    ): MonsterTextesEntity {
        return monsterEntity.textes.find(
            (monsterTextes) => monsterTextes.lang === lang,
        );
    }

    private getCategoryNameByLang(
        categoryEntity: CategoryJsonEntity,
        lang: string,
    ): CategoryName {
        return categoryEntity.names.find(
            (categoryName) => categoryName.lang === lang,
        );
    }

    private filterMonsterEntitiesByCategory(
        monsterEntities: MonsterJsonEntity[],
        categoryEntity: CategoryJsonEntity,
    ): MonsterJsonEntity[] {
        return monsterEntities.filter(
            (monsterEntity) => monsterEntity.category === categoryEntity.code,
        );
    }

    private mapMonsterEntitiesToMonsterByCategory(
        monsterEntities: MonsterJsonEntity[],
        lang: string,
    ): MonsterForCategory[] {
        return monsterEntities.map((monsterEntity) => {
            const monsterTextes = this.getMonsterTextesByLang(
                monsterEntity,
                lang,
            );
            return new MonsterForCategory(
                monsterEntity.code,
                {
                    name: monsterTextes.name,
                },
                monsterEntity.extension,
            );
        });
    }

    private getMonsterTextesByLang(
        monsterEntity: MonsterJsonEntity,
        lang: string,
    ): MonsterTextesEntity {
        return monsterEntity.textes.find((text) => text.lang === lang);
    }

    private sortMonstersByCategoryAlphabetically(
        monstersByCategory: MonstersByCategory[],
    ): MonstersByCategory[] {
        return monstersByCategory
            .sort((prev, next) =>
                prev.category.name.localeCompare(next.category.name),
            )
            .map((monstersByCategory) => {
                return {
                    ...monstersByCategory,
                    monsters: monstersByCategory.monsters.sort((prev, next) =>
                        prev.textes.name.localeCompare(next.textes.name),
                    ),
                };
            });
    }
}
