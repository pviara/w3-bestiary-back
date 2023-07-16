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

    getMonstersByCategories(
        lang: string,
    ): Result<MonstersByCategory[]> | Error {
        const [categoryEntities, monsterEntities] = [
            this.fileService.getAllMonsterCategoriesFromJsonFile(),
            this.fileService.getAllMonsterFromJsonFile(),
        ];

        const monstersByCategoryList = categoryEntities.map<MonstersByCategory>(
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

        if (monstersByCategoryList.includes(undefined)) {
            return new Error(
                HttpStatus.NOT_FOUND,
                `Given lang "${lang}" didn't match at least one category's name language.`,
            );
        }

        return new Result(monstersByCategoryList);
    }

    getByCode(code: string, lang: string): Result<Monster> | Error {
        throw new NotImplementedException();
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

    private getMonsterTextesByLang(
        monsterEntity: MonsterJsonEntity,
        lang: string,
    ): MonsterTextesEntity {
        return monsterEntity.textes.find((text) => text.lang === lang);
    }

    private mapMonsterEntitiesToMonsterByCategory(
        filteredMonsterEntities: MonsterJsonEntity[],
        lang: string,
    ): MonsterForCategory[] {
        return filteredMonsterEntities.map((monsterEntity) => {
            const monsterTextes = this.getMonsterTextesByLang(
                monsterEntity,
                lang,
            );
            return new MonsterForCategory(
                monsterEntity.code,
                monsterTextes,
                monsterEntity.extension,
            );
        });
    }
}
