export class Monster {
    constructor(
        readonly category: string,
        readonly code: string,
        readonly textes: MonsterTextes,
        readonly weakspots: MonsterWeakspots
    ) {}
}

export class MonsterTextes {
    constructor(
        readonly description: string,
        readonly name: string,
        readonly quote: MonsterTextesQuote,
    ) {}
}

export class MonsterTextesQuote {
    constructor(
        readonly author: MonsterTextesQuoteAuthor,
        readonly text: string
    ) {}
}

export class MonsterTextesQuoteAuthor {
    constructor(
        readonly firstname: string,
        readonly lastname: string,
        readonly title: string,
    ) {}
}

export class MonsterWeakspots {
    constructor(
        readonly bombs: string[],
        readonly oils: string[],
        readonly potions: string[],
        readonly signs: string[]
    ) {}
}

export class MonstersByCategoryCategory {
    constructor(
        readonly code: string,
        readonly name: string
    ) {}
}

export class MonstersByCategory {
    constructor(
        readonly category: MonstersByCategoryCategory,
        readonly monsters: Monster[]
    ) {}
}
