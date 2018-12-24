import {Document, Schema, model} from 'mongoose';
import {Agreement} from "../interfaces/agreement";

export const agreementModel = model<Agreement & Document>('Agreement', new Schema({
    partner: Object,
    number: String,
    date: Date,
    name: String,
    type: String,
    shortDescription: String,
}));
