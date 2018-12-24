import { Document, Schema, model} from 'mongoose';
import {Act} from "../interfaces/act";

export const actModel = model<Act & Document>('Act', new Schema({
    partner: String,
    date: Date,
    number: String,
    goods: Array,
    agreement: String,
    type: String,
}));
