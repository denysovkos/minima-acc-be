import { Document, Schema, model} from 'mongoose';
import {UserInterface} from "../interfaces/user";

export const userModel = model<UserInterface & Document>('User', new Schema({
    email: {
        type: String,
        unique: true,
        required : true,
    },
    firstName: String,
    lastName: String,
    phone: String,
    hash: String,
    validated: Boolean,
    token: String,
    partners: Array,
    agreements: Array,
    acts: Array,
    invoices: Array,
    notificationEvents: Array,
    goodsOrServices: Array,
    warehouse: String
}));
