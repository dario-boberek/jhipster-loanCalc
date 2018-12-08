import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { JhiAlertService } from 'ng-jhipster';

import { ILoan } from 'app/shared/model/loan.model';
import { LoanService } from './loan.service';
import { ICustomer } from 'app/shared/model/customer.model';
import { CustomerService } from 'app/entities/customer';

@Component({
    selector: 'jhi-loan-update',
    templateUrl: './loan-update.component.html'
})
export class LoanUpdateComponent implements OnInit {
    loan: ILoan;
    isSaving: boolean;

    customers: ICustomer[];
    startDate: string;
    endDate: string;

    constructor(
        private jhiAlertService: JhiAlertService,
        private loanService: LoanService,
        private customerService: CustomerService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ loan }) => {
            this.loan = loan;
            this.startDate = this.loan.startDate != null ? this.loan.startDate.format(DATE_TIME_FORMAT) : null;
            this.endDate = this.loan.endDate != null ? this.loan.endDate.format(DATE_TIME_FORMAT) : null;
        });
        this.customerService.query().subscribe(
            (res: HttpResponse<ICustomer[]>) => {
                this.customers = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        this.loan.startDate = this.startDate != null ? moment(this.startDate, DATE_TIME_FORMAT) : null;
        this.loan.endDate = this.endDate != null ? moment(this.endDate, DATE_TIME_FORMAT) : null;
        if (this.loan.id !== undefined) {
            this.subscribeToSaveResponse(this.loanService.update(this.loan));
        } else {
            this.subscribeToSaveResponse(this.loanService.create(this.loan));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ILoan>>) {
        result.subscribe((res: HttpResponse<ILoan>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackCustomerById(index: number, item: ICustomer) {
        return item.id;
    }
}
