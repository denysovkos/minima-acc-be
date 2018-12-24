import {CompanyInterface} from "./company";
import {Good, Service} from "./goodsOrServices";
import {Agreement} from "./agreement";

export interface Invoice {
    date: Date;
    number: number | string;
    partner: CompanyInterface;
    goodsOrServices: InvoiceGoodsOrServices[];
    agreement?: Agreement;
}

export interface InvoiceGoodsOrServices extends Good, Service {
    qtty: number;
    price: number;
    total: number;
}
