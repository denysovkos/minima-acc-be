import {Document, Schema, model} from 'mongoose';
import {Invoice} from "../interfaces/invoice";

export const invoiceModel = model<Invoice & Document>('Invoice', new Schema({
    date: Date,
    number: String,
    partner: String,
    goodsOrServices: Array,
    agreement: String,
}));
