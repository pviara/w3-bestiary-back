export type StringReplaceValue = { placeholder: string; newValue: string };

export class Helper {
    static normalizeCode(code: string) {
        const regExp = new RegExp(' ', 'g');
        return code.replace(regExp, '-');
    }

    static replace(
        source: string,
        ...replaceValues: StringReplaceValue[]
    ): string {
        let transformed = source;

        for (const replaceValue of replaceValues) {
            if (!transformed.includes(replaceValue.placeholder)) {
                throw new Error(
                    `Given string "${transformed}" doesn't include placeholder "${replaceValue.placeholder}".`,
                );
            }

            transformed = transformed.replace(
                replaceValue.placeholder,
                replaceValue.newValue,
            );
        }

        return transformed;
    }
}
