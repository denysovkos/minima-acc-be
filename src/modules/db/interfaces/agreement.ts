import {CompanyInterface} from "./company";

export interface Agreement {
    partner: CompanyInterface;
    number: number | string;
    date: Date;
    name: string;
    type: string;
    shortDescription?: string;
}
