import {Document, Schema, model} from 'mongoose';
import {Good, Service} from "../interfaces/goodsOrServices";

export const goodsOrServicesModel = model<Good & Service & Document>('GoodsOrServices', new Schema({
    name: String,
    units: String,
    type: String,
}));

// type can be: goods | services
