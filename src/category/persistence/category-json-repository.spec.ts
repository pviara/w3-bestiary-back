import { CategoryJsonEntity } from './category-json-entity';
import { CategoryFileService } from 'src/file/application/category-file-service.interface';
import { CategoryJsonRepository } from './category-json-repository';
import { Error } from '../../application/error';

describe('CategoryJsonRepository', () => {
    let sut: CategoryJsonRepository;
    let fileService: FileServiceSpy;

    beforeEach(() => {
        fileService = new FileServiceSpy();
        sut = new CategoryJsonRepository(fileService);
    });

    describe('getAll', () => {
        it('should access data from the categories json file using file service', () => {
            sut.getAll('lang');

            expect(fileService.callCount).toBe(1);
        });

        it("should return an error when given lang doesn't match at least one category's name language", () => {
            const otherLang = 'other_lang';
            const anotherLang = 'another_lang';

            const categoryEntities: CategoryJsonEntity[] = [
                {
                    code: 'code_1',
                    names: [
                        {
                            lang: otherLang,
                            name: 'target_lang_name_1',
                        },
                        {
                            lang: anotherLang,
                            name: 'another_lang_name_1',
                        },
                    ],
                },
                {
                    code: 'code_2',
                    names: [
                        {
                            lang: otherLang,
                            name: 'target_lang_name_2',
                        },
                        {
                            lang: anotherLang,
                            name: 'another_lang_name_2',
                        },
                    ],
                },
                {
                    code: 'code_3',
                    names: [
                        {
                            lang: otherLang,
                            name: 'other_lang_name_3',
                        },
                        {
                            lang: anotherLang,
                            name: 'another_lang_name_3',
                        },
                    ],
                },
            ];

            stubGetAllMonsterCategoriesFromJsonFile(
                fileService,
                categoryEntities,
            );

            const result = sut.getAll('unknown_lang');

            expect(result).toBeInstanceOf(Error);
        });

        it('should only return categories which name language matches given lang', () => {
            const targetLang = 'target_lang';
            const otherLang = 'other_lang';

            const categoryEntities: CategoryJsonEntity[] = [
                {
                    code: 'code_1',
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
                    code: 'code_2',
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
                    code: 'code_3',
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
            ];

            stubGetAllMonsterCategoriesFromJsonFile(
                fileService,
                categoryEntities,
            );

            const result = sut.getAll(targetLang);

            const everyCategoryNameMatchesTargetLangName = (): boolean => {
                if (result instanceof Error) {
                    return false;
                }

                // ? https://stackoverflow.com/questions/34137250/why-does-array-prototype-every-return-true-on-an-empty-array
                if (result.data.length === 0) {
                    return false;
                }

                return result.data.every((category) => {
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
    });
});

export class FileServiceSpy implements CategoryFileService {
    callCount = 0;

    getAllMonsterCategoriesFromJsonFile(): CategoryJsonEntity[] {
        this.callCount++;
        return [];
    }
}

function stubGetAllMonsterCategoriesFromJsonFile(
    fileService: CategoryFileService,
    categoryEntities: CategoryJsonEntity[],
): void {
    fileService.getAllMonsterCategoriesFromJsonFile =
        (): CategoryJsonEntity[] => {
            return categoryEntities;
        };
}
