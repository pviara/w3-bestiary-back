import { Document } from 'mongoose';
import { Helper } from 'src/utils/helper';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class TypoDocument {
    @Prop({
        lower: true,
        required: true,
        set: Helper.normalizeCode,
        type: String,
    })
    lang: string;

    @Prop({
        lower: true,
        required: true,
        set: Helper.normalizeCode,
        type: String,
    })
    monsterCode: string;

    @Prop({
        required: true,
        type: String,
    })
    content: string;
}

export type TypoEntity = TypoDocument & Document;

export const typoSchema = SchemaFactory.createForClass(TypoDocument);
