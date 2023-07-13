import { Error } from '../../application/error';
import { ItemFileService } from '../../file/application/item-file-service.interface';
import { Item } from '../domain/item';
import { ItemJsonEntity } from './item-json-entity';
import { ItemJsonRepository } from './item-json-repository';

describe('ItemJsonRepository', () => {
    let sut: ItemJsonRepository;
    let fileService: FileServiceSpy;

    beforeEach(() => {
        fileService = new FileServiceSpy();
        sut = new ItemJsonRepository(fileService);
    });

    describe('getAll', () => {
        it('should access data from the items json file using file service', async () => {
            await sut.getAll('lang');

            expect(fileService.callCount).toBe(1);
        });

        it("should return an error when given lang doesn't match at least one item's name language", async () => {
            const otherLang = 'other_lang';
            const anotherLang = 'another_lang';

            const itemEntities: ItemJsonEntity[] = [
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

            stubGetAllItemsFromJsonFile(fileService, itemEntities);

            const result = await sut.getAll('unknown_lang');

            expect(result).toBeInstanceOf(Error);
        });

        it('should only return items which name language matches given lang', async () => {
            const targetLang = 'target_lang';
            const otherLang = 'other_lang';

            const itemEntities: ItemJsonEntity[] = [
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

            stubGetAllItemsFromJsonFile(fileService, itemEntities);

            const result = await sut.getAll(targetLang);

            const everyItemNameMatchesTargetLangName = (): boolean => {
                if (result instanceof Error) {
                    return false;
                }

                // ? https://stackoverflow.com/questions/34137250/why-does-array-prototype-every-return-true-on-an-empty-array
                if (result.data.length === 0) {
                    return false;
                }

                return result.data.every((item) => {
                    const itemEntity = itemEntities.find(
                        (itemEntity) => itemEntity.code === item.code,
                    );
                    const targetItemName = itemEntity.names.find(
                        (itemName) => itemName.lang === targetLang,
                    );

                    return targetItemName.name === item.name;
                });
            };

            expect(everyItemNameMatchesTargetLangName()).toBe(true);
        });
    });
});

export class FileServiceSpy implements ItemFileService {
    callCount = 0;

    getAllItemsFromJsonFile(): ItemJsonEntity[] {
        this.callCount++;
        return [];
    }
}

function stubGetAllItemsFromJsonFile(
    fileService: ItemFileService,
    itemEntities: ItemJsonEntity[],
): void {
    fileService.getAllItemsFromJsonFile = (): ItemJsonEntity[] => {
        return itemEntities;
    };
}
