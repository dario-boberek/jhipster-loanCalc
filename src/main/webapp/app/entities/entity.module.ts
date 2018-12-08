import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { LoanCalcLoanModule } from './loan/loan.module';
import { LoanCalcCustomerModule } from './customer/customer.module';
/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    // prettier-ignore
    imports: [
        LoanCalcLoanModule,
        LoanCalcCustomerModule,
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoanCalcEntityModule {}
