export interface UserInterface {
    email: string;
    firstName: string;
    lastName?: string;
    phone?: string;
    hash: string;
    validated?: boolean;
    _id?: string;
    partners: string[];
    agreements: string[];
    acts: string[];
    invoices: string[];
    // Notifications events
    notificationEvents: Notification[];
}

interface Notification {
   type: string;
   from: string;
   date: Date;
}
