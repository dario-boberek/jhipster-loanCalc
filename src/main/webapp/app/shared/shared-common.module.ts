import { NgModule } from '@angular/core';

import { LoanCalcSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent } from './';

@NgModule({
    imports: [LoanCalcSharedLibsModule],
    declarations: [JhiAlertComponent, JhiAlertErrorComponent],
    exports: [LoanCalcSharedLibsModule, JhiAlertComponent, JhiAlertErrorComponent]
})
export class LoanCalcSharedCommonModule {}
