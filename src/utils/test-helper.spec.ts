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

    describe('generateString()', () => {
        it('should throw an error if given length is below 1', () => {
            expect(() => sut.generateString(0)).toThrow(Error);
            expect(() => sut.generateString(-1)).toThrow(Error);
        });

        it('should throw an error if given length is not natural', () => {
            expect(() => sut.generateString(0.41)).toThrow(Error);
            expect(() => sut.generateString(12.8)).toThrow(Error);
        });

        it('should return a string of the length that has been given', () => {
            const length = 12;
            const result = sut.generateString(length);

            expect(result.length).toBe(length);
        });
    });
});
