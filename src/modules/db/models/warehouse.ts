import {Document, Schema, model} from 'mongoose';
import {Warehouse} from "../interfaces/warehouse";

export const warehouseModel = model<Warehouse & Document>('Warehouse', new Schema({
    goods: Array,
    services: Array,
    userId: String,
}));
