import { Document, Schema, model} from 'mongoose';
import {Act} from "../interfaces/act";

export const actModel = model<Act & Document>('Act', new Schema({
    partner: {
        _id: String,
        companyName: String,
        inn: String,
        bankInfo: String,
        address: String,
        phone: String,
        ceo: String,
    },
    date: Date,
    number: String,
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
    type: String,
}));
