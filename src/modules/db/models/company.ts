import { Document, Schema, model} from 'mongoose';
import {CompanyInterface} from "../interfaces/company";

export const companyModel = model<CompanyInterface & Document>('Company', new Schema({
    userId: {
        type: String,
    },
    companyName: {
        type: String,
        required : true,
    },
    type: String,
    inn: {
        type: String,
        unique: true,
        required : true,
    },
    address: String,
    phone: String,
    ceo: String,
    accountant: String,
    bankInfo: {
        type: String,
    }
}));
