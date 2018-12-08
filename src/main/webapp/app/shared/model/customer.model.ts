import { ILoan } from 'app/shared/model//loan.model';

export interface ICustomer {
    id?: number;
    customerId?: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    loans?: ILoan[];
}

export class Customer implements ICustomer {
    constructor(
        public id?: number,
        public customerId?: number,
        public firstName?: string,
        public lastName?: string,
        public email?: string,
        public phoneNumber?: string,
        public loans?: ILoan[]
    ) {}
}
