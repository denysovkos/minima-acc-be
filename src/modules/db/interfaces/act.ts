import {CompanyInterface} from "./company";
import {Agreement} from "./agreement";
import {InvoiceGoodsOrServices} from "./invoice";

export interface Act {
    partner: CompanyInterface;
    date: Date;
    number: number | string;
    goods: InvoiceGoodsOrServices[];
    agreement?: Agreement;
    type: 'local' | 'international';
}
