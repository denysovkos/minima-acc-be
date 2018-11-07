import { Document, Schema, model} from 'mongoose';
import {UserInterface} from "../interfaces/user";

export const userModel = model<UserInterface & Document>('User', new Schema({
    email: String,
    firstName: String,
    lastName: String,
    phone: String,
    hash: String,
    validated: Boolean,
    token: String,
}));
