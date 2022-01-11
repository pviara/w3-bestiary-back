import { Provider } from "@nestjs/common";
import { ItemRepositoryImplement } from "./item-repository.implement";

export const ItemRepoProvider: Provider = {
    provide: 'ItemRepo',
    useClass: ItemRepositoryImplement
};
