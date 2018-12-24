import {Good, Service} from "./goodsOrServices";

export interface Warehouse {
    goods: GoodsWarehouse[];
    services: ServicesWarehouse[];
    userId: string;
}

export interface GoodsWarehouse extends Good {
    qtty: number;
    price: number;
}

export interface ServicesWarehouse extends Service {
    qtty: number;
    price: number;
}
