import {Document, Schema, model} from 'mongoose';
import {Invoice} from "../interfaces/invoice";

export const invoiceModel = model<Invoice & Document>('Invoice', new Schema({
    date: Date,
    number: String,
    partner: {
        _id: String,
        companyName: String,
        inn: String,
        bankInfo: String,
        address: String,
        phone: String,
        ceo: String,
    },
    goods: [{
        name: String,
        units: String,
        price: Number,
    }],
    agreement: {
        _id: String,
        number: String,
        date: Date,
        name: String
    },
}));
