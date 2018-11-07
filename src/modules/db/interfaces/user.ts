export interface UserInterface {
    email: string;
    firstName: string;
    lastName?: string;
    phone?: string;
    hash: string;
    validated?: boolean;
    _id?: string;
}
