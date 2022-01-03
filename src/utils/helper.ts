export class Helper {
	static replace(
		source: string,
		...replaceValues: { placeholder: string; newValue: string }[]
	): string {
		let transformed = source;

		for (const replaceValue of replaceValues) {
			if (!transformed.includes(replaceValue.placeholder)) {
				throw new Error(
					`Given string "${transformed}" doesn't include placeholder "${replaceValue.placeholder}".`
				);
			}

			transformed = transformed.replace(
				replaceValue.placeholder,
				replaceValue.newValue
			);
		}

		return transformed;
	}
}
