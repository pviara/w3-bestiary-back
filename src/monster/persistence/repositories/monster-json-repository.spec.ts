import { CategoryJsonEntity } from 'src/category/persistence/category-json-entity';
import { Error } from '../../../application/error';
import { MonsterFileService } from '../../../file/application/monster-file-service.interface';
import { MonsterJsonEntity } from '../entities/monster-json-entity';
import { MonsterJsonRepository } from './monster-json-repository';

describe('MonsterJsonRepository', () => {
    let sut: MonsterJsonRepository;
    let fileService: FileServiceSpy;

    beforeEach(() => {
        fileService = new FileServiceSpy();
        sut = new MonsterJsonRepository(fileService);
    });

    describe('getMonstersByCategories', () => {
        // * test cases
        // // * -> should access data from the categories json file using file service
        // // * -> should access data from the monsters json file using file service
        // // * -> should return an array which length equals the amount of categories
        // // * -> should return an array which category language all match given lang
        // // * -> should return an array which monsters language all match given lang
        // * -> should return an error when at least one category/monster name hasn't been found for given lang

        it('should access data from the categories json file using file service', () => {
            sut.getMonstersByCategories('lang');

            expect(
                fileService.methodCallCounts
                    .getAllMonsterCategoriesFromJsonFile,
            ).toBe(1);
        });

        it('should access data from the monsters json file using file service', () => {
            sut.getMonstersByCategories('lang');

            expect(fileService.methodCallCounts.getAllMonsterFromJsonFile).toBe(
                1,
            );
        });

        it('should return an array which length equals the amount of categories', () => {
            const targetLang = 'target_lang';

            const categoryEntities: CategoryJsonEntity[] = [
                {
                    code: 'code1',
                    names: [
                        {
                            lang: targetLang,
                            name: 'name_for_lang1',
                        },
                        {
                            lang: 'lang2',
                            name: 'name_for_lang2',
                        },
                    ],
                },
            ];

            stubGetAllMonsterCategoriesFromJsonFile(
                fileService,
                categoryEntities,
            );

            const result = sut.getMonstersByCategories(targetLang);

            const returnedArrayLengthMatchCategoryArrayLength = (): boolean => {
                if (result instanceof Error) {
                    return false;
                }

                return result.data.length === categoryEntities.length;
            };

            expect(returnedArrayLengthMatchCategoryArrayLength()).toBe(true);
        });

        it('should return an array which category language all match given lang', () => {
            const targetLang = 'target_lang';
            const otherLang = 'other_lang';

            const categoryEntities: CategoryJsonEntity[] = [
                {
                    code: 'code1',
                    names: [
                        {
                            lang: targetLang,
                            name: 'target_lang_name_1',
                        },
                        {
                            lang: otherLang,
                            name: 'other_lang_name_1',
                        },
                    ],
                },
                {
                    code: 'code2',
                    names: [
                        {
                            lang: targetLang,
                            name: 'target_lang_name_2',
                        },
                        {
                            lang: otherLang,
                            name: 'other_lang_name_2',
                        },
                    ],
                },
                {
                    code: 'code3',
                    names: [
                        {
                            lang: targetLang,
                            name: 'target_lang_name_3',
                        },
                        {
                            lang: otherLang,
                            name: 'other_lang_name_3',
                        },
                    ],
                },
                {
                    code: 'code4',
                    names: [
                        {
                            lang: targetLang,
                            name: 'target_lang_name_4',
                        },
                        {
                            lang: otherLang,
                            name: 'other_lang_name_4',
                        },
                    ],
                },
            ];

            stubGetAllMonsterCategoriesFromJsonFile(
                fileService,
                categoryEntities,
            );

            const result = sut.getMonstersByCategories(targetLang);

            const everyCategoryNameMatchesTargetLangName = (): boolean => {
                if (result instanceof Error) {
                    return false;
                }

                if (result.data.length === 0) {
                    return false;
                }

                return result.data.every(({ category }) => {
                    const categoryEntity = categoryEntities.find(
                        (categoryEntity) =>
                            categoryEntity.code === category.code,
                    );
                    const targetCategoryName = categoryEntity.names.find(
                        (categoryName) => categoryName.lang === targetLang,
                    );

                    return targetCategoryName.name === category.name;
                });
            };

            expect(everyCategoryNameMatchesTargetLangName()).toBe(true);
        });

        it('should return an array which monsters textes language all match given lang', () => {
            const targetLang = 'target_lang';
            const otherLang = 'other_lang';

            const categoryEntities: CategoryJsonEntity[] = [
                {
                    code: 'code1',
                    names: [
                        {
                            lang: targetLang,
                            name: 'target_lang_name_1',
                        },
                        {
                            lang: otherLang,
                            name: 'other_lang_name_1',
                        },
                    ],
                },
                {
                    code: 'code2',
                    names: [
                        {
                            lang: targetLang,
                            name: 'target_lang_name_2',
                        },
                        {
                            lang: otherLang,
                            name: 'other_lang_name_2',
                        },
                    ],
                },
                {
                    code: 'code3',
                    names: [
                        {
                            lang: targetLang,
                            name: 'target_lang_name_3',
                        },
                        {
                            lang: otherLang,
                            name: 'other_lang_name_3',
                        },
                    ],
                },
                {
                    code: 'code4',
                    names: [
                        {
                            lang: targetLang,
                            name: 'target_lang_name_4',
                        },
                        {
                            lang: otherLang,
                            name: 'other_lang_name_4',
                        },
                    ],
                },
            ];

            const monsterEntities: MonsterJsonEntity[] = [
                {
                    code: 'code1',
                    category: 'category1',
                    textes: [
                        {
                            lang: targetLang,
                            name: 'target_lang_name_1',
                            description: 'description',
                            quote: {
                                author: {
                                    firstname: 'firstname',
                                    lastname: 'lastname',
                                    title: 'title',
                                },
                                text: 'text',
                            },
                        },
                        {
                            lang: otherLang,
                            name: 'other_lang_name_1',
                            description: 'description',
                            quote: {
                                author: {
                                    firstname: 'firstname',
                                    lastname: 'lastname',
                                    title: 'title',
                                },
                                text: 'text',
                            },
                        },
                    ],
                    weakspots: {
                        bombs: [],
                        potions: [],
                        signs: [],
                    },
                },
                {
                    code: 'code2',
                    category: 'category1',
                    textes: [
                        {
                            lang: targetLang,
                            name: 'target_lang_name_2',
                            description: 'description',
                            quote: {
                                author: {
                                    firstname: 'firstname',
                                    lastname: 'lastname',
                                    title: 'title',
                                },
                                text: 'text',
                            },
                        },
                        {
                            lang: otherLang,
                            name: 'other_lang_name_2',
                            description: 'description',
                            quote: {
                                author: {
                                    firstname: 'firstname',
                                    lastname: 'lastname',
                                    title: 'title',
                                },
                                text: 'text',
                            },
                        },
                    ],
                    weakspots: {
                        bombs: [],
                        potions: [],
                        signs: [],
                    },
                },
            ];

            stubGetAllMonsterCategoriesFromJsonFile(
                fileService,
                categoryEntities,
            );

            stubGetAllMonstersFromJsonFile(fileService, monsterEntities);

            const result = sut.getMonstersByCategories(targetLang);

            const everyMonsterTextesMatchTargetLangTextes = (): boolean => {
                if (result instanceof Error) {
                    return false;
                }

                if (result.data.length === 0) {
                    return false;
                }

                return result.data
                    .map((monstersByCategory) => monstersByCategory.monsters)
                    .flat()
                    .every((monster) => {
                        const monsterEntity = monsterEntities.find(
                            (monsterEntity) =>
                                monsterEntity.code === monster.code,
                        );
                        const targetMonsterTextes = monsterEntity.textes.find(
                            (monsterTextes) =>
                                monsterTextes.lang === targetLang,
                        );

                        return targetMonsterTextes.name === monster.textes.name;
                    });
            };

            expect(everyMonsterTextesMatchTargetLangTextes()).toBe(true);
        });

        it('should return an array which monsters belong to the right category', () => {
            const targetLang = 'target_lang';
            const otherLang = 'other_lang';

            const categoryEntities: CategoryJsonEntity[] = [
                {
                    code: 'code1',
                    names: [
                        {
                            lang: targetLang,
                            name: 'target_lang_name_1',
                        },
                        {
                            lang: otherLang,
                            name: 'other_lang_name_1',
                        },
                    ],
                },
                {
                    code: 'code2',
                    names: [
                        {
                            lang: targetLang,
                            name: 'target_lang_name_2',
                        },
                        {
                            lang: otherLang,
                            name: 'other_lang_name_2',
                        },
                    ],
                },
            ];
            const [categoryCode1, categoryCode2] = categoryEntities.map(
                (categoryEntity) => categoryEntity.code,
            );

            const monsterEntities: MonsterJsonEntity[] = [
                {
                    code: 'code1',
                    category: categoryCode1,
                    textes: [
                        {
                            lang: targetLang,
                            name: 'target_lang_name_1',
                            description: 'description',
                            quote: {
                                author: {
                                    firstname: 'firstname',
                                    lastname: 'lastname',
                                    title: 'title',
                                },
                                text: 'text',
                            },
                        },
                        {
                            lang: otherLang,
                            name: 'other_lang_name_1',
                            description: 'description',
                            quote: {
                                author: {
                                    firstname: 'firstname',
                                    lastname: 'lastname',
                                    title: 'title',
                                },
                                text: 'text',
                            },
                        },
                    ],
                    weakspots: {
                        bombs: [],
                        potions: [],
                        signs: [],
                    },
                },
                {
                    code: 'code2',
                    category: categoryCode1,
                    textes: [
                        {
                            lang: targetLang,
                            name: 'target_lang_name_2',
                            description: 'description',
                            quote: {
                                author: {
                                    firstname: 'firstname',
                                    lastname: 'lastname',
                                    title: 'title',
                                },
                                text: 'text',
                            },
                        },
                        {
                            lang: otherLang,
                            name: 'other_lang_name_2',
                            description: 'description',
                            quote: {
                                author: {
                                    firstname: 'firstname',
                                    lastname: 'lastname',
                                    title: 'title',
                                },
                                text: 'text',
                            },
                        },
                    ],
                    weakspots: {
                        bombs: [],
                        potions: [],
                        signs: [],
                    },
                },
                {
                    code: 'code3',
                    category: categoryCode2,
                    textes: [
                        {
                            lang: targetLang,
                            name: 'target_lang_name_3',
                            description: 'description',
                            quote: {
                                author: {
                                    firstname: 'firstname',
                                    lastname: 'lastname',
                                    title: 'title',
                                },
                                text: 'text',
                            },
                        },
                        {
                            lang: otherLang,
                            name: 'other_lang_name_3',
                            description: 'description',
                            quote: {
                                author: {
                                    firstname: 'firstname',
                                    lastname: 'lastname',
                                    title: 'title',
                                },
                                text: 'text',
                            },
                        },
                    ],
                    weakspots: {
                        bombs: [],
                        potions: [],
                        signs: [],
                    },
                },
            ];

            stubGetAllMonsterCategoriesFromJsonFile(
                fileService,
                categoryEntities,
            );

            stubGetAllMonstersFromJsonFile(fileService, monsterEntities);

            const result = sut.getMonstersByCategories(targetLang);

            const everyMonsterBelongsToTheirCategory = (): boolean => {
                if (result instanceof Error) {
                    return false;
                }

                if (result.data.length === 0) {
                    return false;
                }

                return result.data.every((monstersByCategory) => {
                    return monstersByCategory.monsters.every(
                        (monsterByCategory) => {
                            const monsterEntity = monsterEntities.find(
                                (monsterEntity) =>
                                    monsterEntity.code ===
                                    monsterByCategory.code,
                            );
                            return (
                                monstersByCategory.category.code ===
                                monsterEntity.category
                            );
                        },
                    );
                });
            };

            expect(everyMonsterBelongsToTheirCategory()).toBe(true);
        });

        it("should return an error when at least one category name hasn't been found for given lang", () => {
            const targetLang = 'target_lang';
            const otherLang = 'other_lang';

            const categoryEntities: CategoryJsonEntity[] = [
                {
                    code: 'code1',
                    names: [
                        {
                            lang: otherLang,
                            name: 'other_lang_name_1',
                        },
                    ],
                },
                {
                    code: 'code2',
                    names: [
                        {
                            lang: targetLang,
                            name: 'target_lang_name_2',
                        },
                        {
                            lang: otherLang,
                            name: 'other_lang_name_2',
                        },
                    ],
                },
                {
                    code: 'code3',
                    names: [
                        {
                            lang: targetLang,
                            name: 'target_lang_name_3',
                        },
                        {
                            lang: otherLang,
                            name: 'other_lang_name_3',
                        },
                    ],
                },
                {
                    code: 'code4',
                    names: [
                        {
                            lang: targetLang,
                            name: 'target_lang_name_4',
                        },
                        {
                            lang: otherLang,
                            name: 'other_lang_name_4',
                        },
                    ],
                },
            ];

            const monsterEntities: MonsterJsonEntity[] = [
                {
                    code: 'code1',
                    category: 'category1',
                    textes: [
                        {
                            lang: targetLang,
                            name: 'target_lang_name_1',
                            description: 'description',
                            quote: {
                                author: {
                                    firstname: 'firstname',
                                    lastname: 'lastname',
                                    title: 'title',
                                },
                                text: 'text',
                            },
                        },
                        {
                            lang: otherLang,
                            name: 'other_lang_name_1',
                            description: 'description',
                            quote: {
                                author: {
                                    firstname: 'firstname',
                                    lastname: 'lastname',
                                    title: 'title',
                                },
                                text: 'text',
                            },
                        },
                    ],
                    weakspots: {
                        bombs: [],
                        potions: [],
                        signs: [],
                    },
                },
                {
                    code: 'code2',
                    category: 'category1',
                    textes: [
                        {
                            lang: targetLang,
                            name: 'target_lang_name_2',
                            description: 'description',
                            quote: {
                                author: {
                                    firstname: 'firstname',
                                    lastname: 'lastname',
                                    title: 'title',
                                },
                                text: 'text',
                            },
                        },
                        {
                            lang: otherLang,
                            name: 'other_lang_name_2',
                            description: 'description',
                            quote: {
                                author: {
                                    firstname: 'firstname',
                                    lastname: 'lastname',
                                    title: 'title',
                                },
                                text: 'text',
                            },
                        },
                    ],
                    weakspots: {
                        bombs: [],
                        potions: [],
                        signs: [],
                    },
                },
            ];

            stubGetAllMonsterCategoriesFromJsonFile(
                fileService,
                categoryEntities,
            );

            stubGetAllMonstersFromJsonFile(fileService, monsterEntities);

            const result = sut.getMonstersByCategories(targetLang);

            expect(result).toBeInstanceOf(Error);
        });
    });
});

export class FileServiceSpy implements MonsterFileService {
    methodCallCounts = {
        getAllMonsterFromJsonFile: 0,
        getAllMonsterCategoriesFromJsonFile: 0,
    };

    getAllMonsterFromJsonFile(): MonsterJsonEntity[] {
        this.methodCallCounts['getAllMonsterFromJsonFile']++;
        return [];
    }

    getAllMonsterCategoriesFromJsonFile(): CategoryJsonEntity[] {
        this.methodCallCounts['getAllMonsterCategoriesFromJsonFile']++;
        return [];
    }
}

function stubGetAllMonsterCategoriesFromJsonFile(
    fileService: FileServiceSpy,
    categoryEntities: CategoryJsonEntity[],
): void {
    fileService.getAllMonsterCategoriesFromJsonFile =
        (): CategoryJsonEntity[] => {
            return categoryEntities;
        };
}

function stubGetAllMonstersFromJsonFile(
    fileService: FileServiceSpy,
    monsterEntities: MonsterJsonEntity[],
): void {
    fileService.getAllMonsterFromJsonFile = (): MonsterJsonEntity[] => {
        return monsterEntities;
    };
}
