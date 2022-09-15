import { Helper, StringReplaceValue } from './helper';

describe('Helper', () => {
    const sut = Helper;

    describe('normalizeCode', () => {
        it('should return exact same string when given string length is one single word or zero', () => {
            let code = 'word';
            let result = sut.normalizeCode(code);

            expect(result).toBe(code);

            code = '';
            result = sut.normalizeCode(code);

            expect(result).toBe(code);
        });

        it('should replace all whitespaces by dashes', () => {
            const code = 'sample code with whitespaces for testing';
            const result = sut.normalizeCode(code);

            expect(result).toBe('sample-code-with-whitespaces-for-testing');
        });

        it("should not replace any character when given string doesn't contain whitespace", () => {
            const code = 'sample-code-with-whitespaces-for-testing';
            const result = sut.normalizeCode(code);

            expect(result).toBe(code);
        });
    });

    describe('replace', () => {
        it('should return the exact given source when no replace value is given', () => {
            const source = 'sample source for testing';
            const result = sut.replace(source);

            expect(result).toBe(source);
        });

        it('should throw an error when at least one replace value is not found within the source', () => {
            const source =
                'sample source with not the right <placeholder> for testing';
            const replaceValue: StringReplaceValue = {
                placeholder: '<test>',
                newValue: 'new value',
            };

            expect(() => sut.replace(source, replaceValue)).toThrow(Error);
        });

        it('should replace placeholders from the source by their matching new values', () => {
            const [placeholder1, placeholder2] = [
                '<placeholder1>',
                '<placeholder2>',
            ];
            const [newValue1, newValue2] = ['jam', 'cookies'];
            const source = `sample source with some ${placeholder1} and ${placeholder2} for testing`;
            const replaceValues: StringReplaceValue[] = [
                {
                    placeholder: placeholder1,
                    newValue: newValue1,
                },
                {
                    placeholder: placeholder2,
                    newValue: newValue2,
                },
            ];
            const result = sut.replace(source, ...replaceValues);

            expect(result).toBe(
                `sample source with some ${newValue1} and ${newValue2} for testing`,
            );
        });
    });
});
