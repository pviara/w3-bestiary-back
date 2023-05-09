import { ApiProperty } from '@nestjs/swagger';
import { GameExpansionSet } from '../persistence/entities/monster-entity';

export class MonsterTextesQuoteAuthor {
    @ApiProperty()
    readonly firstname: string;

    @ApiProperty()
    readonly lastname: string;

    @ApiProperty()
    readonly title: string;

    constructor(firstname: string, lastname: string, title: string) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.title = title;
    }
}

export class MonsterTextesQuote {
    @ApiProperty()
    readonly author: MonsterTextesQuoteAuthor;

    @ApiProperty()
    readonly text: string;

    constructor(author: MonsterTextesQuoteAuthor, text: string) {
        this.author = author;
        this.text = text;
    }
}

export class MonsterTextes {
    @ApiProperty()
    readonly description: string;

    @ApiProperty()
    readonly name: string;

    @ApiProperty()
    readonly quote?: MonsterTextesQuote;

    constructor(description: string, name: string, quote?: MonsterTextesQuote) {
        this.description = description;
        this.name = name;
        this.quote = quote;
    }
}

export class MonsterWeakspots {
    @ApiProperty()
    readonly bombs: string[];

    @ApiProperty()
    readonly oils: string[];

    @ApiProperty()
    readonly potions: string[];

    @ApiProperty()
    readonly signs: string[];

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
    readonly category: string;

    @ApiProperty()
    readonly code: string;

    @ApiProperty()
    readonly extension?: GameExpansionSet;

    @ApiProperty()
    readonly textes: MonsterTextes;

    @ApiProperty()
    readonly weakspots: MonsterWeakspots;

    constructor(
        category: string,
        code: string,
        textes: MonsterTextes,
        weakspots: MonsterWeakspots,
        extension?: GameExpansionSet,
    ) {
        this.category = category;
        this.code = code;
        this.textes = textes;
        this.category = category;
        this.weakspots = weakspots;
        this.extension = extension;
    }
}

export class MonstersByCategoryCategory {
    @ApiProperty()
    readonly code: string;

    @ApiProperty()
    readonly name: string;

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
    readonly code: string;

    @ApiProperty({
        type: MonsterTextesName,
    })
    readonly textes: Pick<MonsterTextes, 'name'>;

    @ApiProperty({ enum: GameExpansionSet })
    readonly extension?: GameExpansionSet;

    constructor(
        code: string,
        textes: Pick<MonsterTextes, 'name'>,
        extension?: GameExpansionSet,
    ) {
        this.code = code;
        this.textes = textes;
        this.extension = extension;
    }
}

export class MonstersByCategory {
    @ApiProperty()
    readonly category: MonstersByCategoryCategory;

    @ApiProperty({
        type: MonsterByCategory,
        isArray: true,
    })
    readonly monsters: MonsterByCategory[];

    constructor(
        category: MonstersByCategoryCategory,
        monsters: MonsterByCategory[],
    ) {
        this.category = category;
        this.monsters = monsters;
    }
}
