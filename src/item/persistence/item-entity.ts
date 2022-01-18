import { Document } from 'mongoose';
import { Helper } from 'src/utils/helper';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export class ItemName {
    @Prop({ type: String })
    lang: string;

    @Prop({ type: String })
    name: string;
}

@Schema({ _id: false })
export class ItemDocument {
    @Prop({
        lower: true,
        required: true,
        set: Helper.normalizeCode,
        type: String,
    })
    code: string;

    @Prop({ required: true })
    names: ItemName[];
}

export type ItemEntity = ItemDocument & Document;

export const itemSchema = SchemaFactory.createForClass(ItemDocument);
