import { Moment } from 'moment';

export interface ILoan {
    id?: number;
    loanId?: number;
    startDate?: Moment;
    endDate?: Moment;
    principal?: string;
    amount?: number;
    customerId?: number;
}

export class Loan implements ILoan {
    constructor(
        public id?: number,
        public loanId?: number,
        public startDate?: Moment,
        public endDate?: Moment,
        public principal?: string,
        public amount?: number,
        public customerId?: number
    ) {}
}
