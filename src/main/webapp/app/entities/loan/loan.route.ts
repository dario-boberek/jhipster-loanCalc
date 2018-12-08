import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { UserRouteAccessService } from 'app/core';
import { Observable, of } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { Loan } from 'app/shared/model/loan.model';
import { LoanService } from './loan.service';
import { LoanComponent } from './loan.component';
import { LoanDetailComponent } from './loan-detail.component';
import { LoanUpdateComponent } from './loan-update.component';
import { LoanDeletePopupComponent } from './loan-delete-dialog.component';
import { ILoan } from 'app/shared/model/loan.model';

@Injectable({ providedIn: 'root' })
export class LoanResolve implements Resolve<ILoan> {
    constructor(private service: LoanService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Loan> {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(
                filter((response: HttpResponse<Loan>) => response.ok),
                map((loan: HttpResponse<Loan>) => loan.body)
            );
        }
        return of(new Loan());
    }
}

export const loanRoute: Routes = [
    {
        path: 'loan',
        component: LoanComponent,
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Loans'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'loan/:id/view',
        component: LoanDetailComponent,
        resolve: {
            loan: LoanResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Loans'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'loan/new',
        component: LoanUpdateComponent,
        resolve: {
            loan: LoanResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Loans'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'loan/:id/edit',
        component: LoanUpdateComponent,
        resolve: {
            loan: LoanResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Loans'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const loanPopupRoute: Routes = [
    {
        path: 'loan/:id/delete',
        component: LoanDeletePopupComponent,
        resolve: {
            loan: LoanResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'Loans'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
