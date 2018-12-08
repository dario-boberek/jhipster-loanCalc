import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_FORMAT } from 'app/shared/constants/input.constants';
import { map } from 'rxjs/operators';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { ILoan } from 'app/shared/model/loan.model';

type EntityResponseType = HttpResponse<ILoan>;
type EntityArrayResponseType = HttpResponse<ILoan[]>;

@Injectable({ providedIn: 'root' })
export class LoanService {
    public resourceUrl = SERVER_API_URL + 'api/loans';

    constructor(private http: HttpClient) {}

    create(loan: ILoan): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(loan);
        return this.http
            .post<ILoan>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    update(loan: ILoan): Observable<EntityResponseType> {
        const copy = this.convertDateFromClient(loan);
        return this.http
            .put<ILoan>(this.resourceUrl, copy, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http
            .get<ILoan>(`${this.resourceUrl}/${id}`, { observe: 'response' })
            .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http
            .get<ILoan[]>(this.resourceUrl, { params: options, observe: 'response' })
            .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    protected convertDateFromClient(loan: ILoan): ILoan {
        const copy: ILoan = Object.assign({}, loan, {
            startDate: loan.startDate != null && loan.startDate.isValid() ? loan.startDate.toJSON() : null,
            endDate: loan.endDate != null && loan.endDate.isValid() ? loan.endDate.toJSON() : null
        });
        return copy;
    }

    protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
        if (res.body) {
            res.body.startDate = res.body.startDate != null ? moment(res.body.startDate) : null;
            res.body.endDate = res.body.endDate != null ? moment(res.body.endDate) : null;
        }
        return res;
    }

    protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
        if (res.body) {
            res.body.forEach((loan: ILoan) => {
                loan.startDate = loan.startDate != null ? moment(loan.startDate) : null;
                loan.endDate = loan.endDate != null ? moment(loan.endDate) : null;
            });
        }
        return res;
    }
}
