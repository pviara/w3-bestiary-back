import { Document } from 'mongoose';
import { Helper } from '../../utils/helper';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export class CategoryName {
    @Prop({ type: String })
    lang: string;

    @Prop({ type: String })
    name: string;
}

@Schema({ _id: false })
export class CategoryDocument {
    @Prop({
        lower: true,
        required: true,
        set: Helper.normalizeCode,
        type: String,
    })
    code: string;

    @Prop({ required: true })
    names: CategoryName[];
}

export type CategoryEntity = CategoryDocument & Document;

export const categorySchema = SchemaFactory.createForClass(CategoryDocument);
