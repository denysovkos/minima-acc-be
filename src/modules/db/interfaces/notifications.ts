import {CompanyInterface} from "./company";

export interface Notifications {
    from: CompanyInterface;
    date: Date;
    message: string;
}
