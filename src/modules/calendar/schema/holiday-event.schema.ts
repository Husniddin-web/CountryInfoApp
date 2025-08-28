import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HolidayEventDocument = HolidayEvent & Document;

@Schema()
export class HolidayEvent {
  @Prop({ required: true, index: true })
  userId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  countryCode: string;
}

export const HolidayEventSchema = SchemaFactory.createForClass(HolidayEvent);
