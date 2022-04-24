import { CategoryRepoProvider } from './persistence/category-repository.provider';
import { categorySchema } from './persistence/category-entity';
import { CqrsModule } from '@nestjs/cqrs';
import { GetAllCategoriesHandler } from './application/queries/get-all-categories.handler';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

const queryHandlers = [GetAllCategoriesHandler];

@Module({
    controllers: [],
    exports: [],
    imports: [
        CqrsModule,
        MongooseModule.forFeature([
            {
                name: 'Category',
                schema: categorySchema,
            },
        ]),
    ],
    providers: [CategoryRepoProvider, ...queryHandlers],
})
export class CategoryModule {}
