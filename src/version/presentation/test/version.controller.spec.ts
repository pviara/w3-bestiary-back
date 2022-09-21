import { version } from '../../../../package.json';
import { VersionController } from '../version.controller';

describe('VersionController', () => {
    let sut: VersionController;

    beforeEach(() => (sut = new VersionController()));

    describe('getProjectVersion', () => {
        it('should return an AppVersion object with current project version', () => {
            const result = sut.getProjectVersion();
            expect(result.content).toBe(version);
        });
    });
});
