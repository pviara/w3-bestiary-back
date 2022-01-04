import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

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

    @Prop()
    quote: MonsterTextesQuoteEntity;
}

class MonsterWeakspotsEntity {
    @Prop({
        lower: true,
        set: normalizeCode,
        type: [String]
    })
    bombs: string[];

    @Prop({
        lower: true,
        set: normalizeCode,
        type: [String]
    })
    oils: string[];

    @Prop({
        lower: true,
        set: normalizeCode,
        type: [String]
    })
    potions: string[];

    @Prop({
        lower: true,
        set: normalizeCode,
        type: [String]
    })
    signs: string[];
}

function normalizeCode(code: string) {
    const regExp = new RegExp(' ', 'g');
    return code.replace(regExp, '-');
}

@Schema({ _id: false })
export class MonsterDocument {
    @Prop({
        lower: true,
        required: true,
        set: normalizeCode,
        type: String,
        unique: true
    })
    code: string;
    
    @Prop()
    textes: MonsterTextes[];

    @Prop()
    weakspots: MonsterWeakspotsEntity;
}

export type MonsterEntity = MonsterDocument & Document;

export const monsterSchema = SchemaFactory.createForClass(MonsterDocument);