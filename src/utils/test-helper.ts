import { DatabaseModule } from '../infrastructure/database/database.module';
import { DatabaseService } from '../infrastructure/database/database.service';
import { DynamicModule } from '@nestjs/common';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { RouterModule } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';

export class RoutedTestModule {
    constructor(readonly path: string, readonly module: any) {}
}

class RouterTestModule {
    constructor(
        readonly routerModule: DynamicModule,
        readonly importedModules: any[],
    ) {}
}

export class TestHelper {
    static async buildTestingModule(
        routedModules: RoutedTestModule[],
    ): Promise<TestingModule> {
        if (routedModules.length === 0) {
            throw new Error(
                'Given array of routedModules must contain at least one module.',
            );
        }

        const { routerModule, importedModules } =
            this.buildRouterModule(routedModules);

        const testingModule = Test.createTestingModule({
            imports: [routerModule, ...importedModules],
        });

        return await testingModule.compile();
    }

    static buildDatabaseTestingModule(): (
        | DynamicModule
        | typeof DatabaseModule
    )[] {
        return [
            DatabaseModule,
            MongooseModule.forRootAsync({
                imports: [DatabaseModule],
                useFactory: (dbService: DatabaseService) => {
                    const options: MongooseModuleOptions = {
                        uri: dbService.dbTestURI,
                        useNewUrlParser: true,
                        useUnifiedTopology: true,
                    };
                    return options;
                },
                inject: [DatabaseService],
            }),
        ];
    }

    static generateString(length = 5): string {
        if (length <= 0) {
            throw new Error('Given length must be greater than 0.');
        }
        if (!this.isNaturalNumber(length)) {
            throw new Error('Given length must be a natural number.');
        }

        const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

        let finalString = '';
        for (let i = 0; i < length; i++) {
            const randomLetter =
                alphabet[Math.floor(Math.random() * alphabet.length)];
            finalString += randomLetter;
        }

        return finalString;
    }

    private static isNaturalNumber(length: number) {
        return Number(length) >= 0 && Number(length) % 1 === 0;
    }

    private static buildRouterModule(
        routedModules: RoutedTestModule[],
    ): RouterTestModule {
        const importedModules = [];
        const routerModule = RouterModule.register([
            {
                path: 'api',
                children: routedModules.map((routedModule) => {
                    importedModules.push(routedModule.module);
                    return {
                        path: routedModule.path,
                        module: routedModule.module,
                    };
                }),
            },
        ]);

        return {
            routerModule,
            importedModules,
        };
    }
}
