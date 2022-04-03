import { ApiProperty } from '@nestjs/swagger';

export class MonsterTextesQuoteAuthor {
    @ApiProperty()
    public readonly firstname: string;

    @ApiProperty()
    public readonly lastname: string;

    @ApiProperty()
    public readonly title: string;

    constructor(firstname: string, lastname: string, title: string) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.title = title;
    }
}

export class MonsterTextesQuote {
    @ApiProperty()
    public readonly author: MonsterTextesQuoteAuthor;

    @ApiProperty()
    public readonly text: string;

    constructor(author: MonsterTextesQuoteAuthor, text: string) {
        this.author = author;
        this.text = text;
    }
}

export class MonsterTextes {
    @ApiProperty()
    public readonly description: string;

    @ApiProperty()
    public readonly name: string;

    @ApiProperty()
    public readonly quote?: MonsterTextesQuote;

    constructor(description: string, name: string, quote?: MonsterTextesQuote) {
        this.description = description;
        this.name = name;
        this.quote = quote;
    }
}

export class MonsterWeakspots {
    @ApiProperty()
    public readonly bombs: string[];

    @ApiProperty()
    public readonly oils: string[];

    @ApiProperty()
    public readonly potions: string[];

    @ApiProperty()
    public readonly signs: string[];

    constructor(
        bombs: string[],
        oils: string[],
        potions: string[],
        signs: string[],
    ) {
        this.bombs = bombs;
        this.oils = oils;
        this.potions = potions;
        this.signs = signs;
    }
}

export class Monster {
    @ApiProperty()
    public readonly category: string;

    @ApiProperty()
    public readonly code: string;

    @ApiProperty()
    public readonly textes: MonsterTextes;

    @ApiProperty()
    public readonly weakspots: MonsterWeakspots;

    constructor(
        category: string,
        code: string,
        textes: MonsterTextes,
        weakspots: MonsterWeakspots,
    ) {
        this.category = category;
        this.code = code;
        this.textes = textes;
        this.category = category;
        this.weakspots = weakspots;
    }
}

export class MonstersByCategoryCategory {
    @ApiProperty()
    public readonly code: string;

    @ApiProperty()
    public readonly name: string;

    constructor(code: string, name: string) {
        this.code = code;
        this.name = name;
    }
}

class MonsterTextesName {
    @ApiProperty()
    name: string;
}

export class MonsterByCategory {
    @ApiProperty()
    public readonly code: string;

    @ApiProperty({
        type: MonsterTextesName,
    })
    public readonly textes: Pick<MonsterTextes, 'name'>;

    @ApiProperty()
    public readonly extension?: string;

    constructor(
        code: string,
        textes: Pick<MonsterTextes, 'name'>,
        extension?: string,
    ) {
        this.code = code;
        this.textes = textes;
        this.extension = extension;
    }
}

export class MonstersByCategory {
    @ApiProperty()
    public readonly category: MonstersByCategoryCategory;

    @ApiProperty({
        type: MonsterByCategory,
        isArray: true,
    })
    public readonly monsters: MonsterByCategory[];

    constructor(
        category: MonstersByCategoryCategory,
        monsters: MonsterByCategory[],
    ) {
        this.category = category;
        this.monsters = monsters;
    }
}
