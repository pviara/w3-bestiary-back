import { Document } from 'mongoose';
import { Helper } from 'src/utils/helper';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CategoryEntity } from 'src/category/persistence/category-entity';

class MonsterTextesQuoteAuthorEntity {
    @Prop({
        lower: true,
        type: String
    })
    firstname: string;

    @Prop({
        lower: true,
        type: String
    })
    lastname: string;
    
    @Prop({ type: String })
    title: string;
}

class MonsterTextesQuoteEntity {
    @Prop()
    author: MonsterTextesQuoteAuthorEntity;

    @Prop({ type: String })
    text: string;
}

class MonsterTextes {
    @Prop({ type: String })
    lang: string;
    
    @Prop({ type: String })
    description: string;

    @Prop({ type: String })
    name: string;

    @Prop()
    quote: MonsterTextesQuoteEntity;
}

class MonsterWeakspotsEntity {
    @Prop({
        lower: true,
        set: Helper.normalizeCode,
        type: [String]
    })
    bombs: string[];

    @Prop({
        lower: true,
        set: Helper.normalizeCode,
        type: [String]
    })
    oils: string[];

    @Prop({
        lower: true,
        set: Helper.normalizeCode,
        type: [String]
    })
    potions: string[];

    @Prop({
        lower: true,
        set: Helper.normalizeCode,
        type: [String]
    })
    signs: string[];
}

class MonsterByEntityCategoryCategory {
    @Prop()
    lang: string;
    
    @Prop()
    name: string;
}

export class MonstersByCategoryEntity {
    @Prop()
    categories: MonsterByEntityCategoryCategory[];

    @Prop()
    monsters: MonsterEntity[];
}

@Schema({ _id: false })
export class MonsterDocument {
    @Prop({
        lower: true,
        required: true,
        set: Helper.normalizeCode,
        type: String
    })
    category: string;
    
    @Prop({
        lower: true,
        required: true,
        set: Helper.normalizeCode,
        type: String,
        unique: true
    })
    code: string;
    
    @Prop({ required: true })
    textes: MonsterTextes[];

    @Prop({ required: true })
    weakspots: MonsterWeakspotsEntity;
}

export type MonsterEntity = MonsterDocument & Document;

export const monsterSchema = SchemaFactory.createForClass(MonsterDocument);