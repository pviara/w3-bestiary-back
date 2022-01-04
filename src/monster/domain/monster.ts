export class Monster {
    constructor(
        readonly code: string,
        readonly textes: MonsterTextes,
        readonly weakspots: MonsterWeakspots
    ) {}
}

export class MonsterTextes {
    constructor(
        readonly description: string,
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