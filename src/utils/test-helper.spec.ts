import { CategoryModule } from '../category/category.module';
import { RoutedTestModule, TestHelper } from './test-helper';
import { VersionModule } from '../version/version.module';

describe('TestHelper', () => {
    const sut = TestHelper;

    describe('buildTestingModule()', () => {
        it('should throw error when no routedModule is given', async () => {
            const routedModules: RoutedTestModule[] = [];

            await expect(sut.buildTestingModule(routedModules)).rejects.toThrow(
                Error,
            );
        });

        it('should succeed at retrieving the module given when building the testing module', async () => {
            const routedModules: RoutedTestModule[] = [
                {
                    path: 'version',
                    module: VersionModule,
                },
            ];

            const testingModule = await sut.buildTestingModule(routedModules);

            expect(testingModule.select(VersionModule)).not.toBeUndefined();
        });

        it('should throw an error when trying to retrieve a module that was not given when building the testing module', async () => {
            const routedModules: RoutedTestModule[] = [
                {
                    path: 'version',
                    module: VersionModule,
                },
            ];

            const testingModule = await sut.buildTestingModule(routedModules);

            expect(() => testingModule.select(CategoryModule)).toThrowError();
        });
    });
});
