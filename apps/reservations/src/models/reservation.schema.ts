import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';

@Schema({
  versionKey: false,
})
export class ReservationDocument extends AbstractDocument {
  @Prop({ type: Date }) timestamp?: Date;
  @Prop({ type: Date, required: true }) startDate: Date;
  @Prop({ type: Date, required: true }) endDate: Date;
  @Prop({ type: String, required: true }) userId: string;
  @Prop({ type: String }) placeId?: string;
  @Prop({ type: String, required: true /*, unique: true */ }) invoiceId: string;
  @Prop({ type: String }) paymentId?: string;
}

export const ReservationSchema =
  SchemaFactory.createForClass(ReservationDocument);
