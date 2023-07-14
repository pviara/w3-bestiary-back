import { CategoryRepoProvider } from './persistence/category-repository.provider';
import { CqrsModule } from '@nestjs/cqrs';
import { FileModule } from '../file/file.module';
import { GetAllCategoriesHandler } from './application/queries/get-all-categories.handler';
import { Module } from '@nestjs/common';

const queryHandlers = [GetAllCategoriesHandler];

@Module({
    controllers: [],
    exports: [],
    imports: [CqrsModule, FileModule],
    providers: [CategoryRepoProvider, ...queryHandlers],
})
export class CategoryModule {}
