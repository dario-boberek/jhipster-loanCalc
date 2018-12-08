/* tslint:disable no-unused-expression */
import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { LoanComponentsPage, LoanDeleteDialog, LoanUpdatePage } from './loan.page-object';

const expect = chai.expect;

describe('Loan e2e test', () => {
    let navBarPage: NavBarPage;
    let signInPage: SignInPage;
    let loanUpdatePage: LoanUpdatePage;
    let loanComponentsPage: LoanComponentsPage;
    let loanDeleteDialog: LoanDeleteDialog;

    before(async () => {
        await browser.get('/');
        navBarPage = new NavBarPage();
        signInPage = await navBarPage.getSignInPage();
        await signInPage.autoSignInUsing('admin', 'admin');
        await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
    });

    it('should load Loans', async () => {
        await navBarPage.goToEntity('loan');
        loanComponentsPage = new LoanComponentsPage();
        expect(await loanComponentsPage.getTitle()).to.eq('Loans');
    });

    it('should load create Loan page', async () => {
        await loanComponentsPage.clickOnCreateButton();
        loanUpdatePage = new LoanUpdatePage();
        expect(await loanUpdatePage.getPageTitle()).to.eq('Create or edit a Loan');
        await loanUpdatePage.cancel();
    });

    it('should create and save Loans', async () => {
        const nbButtonsBeforeCreate = await loanComponentsPage.countDeleteButtons();

        await loanComponentsPage.clickOnCreateButton();
        await promise.all([
            loanUpdatePage.setLoanIdInput('5'),
            loanUpdatePage.setStartDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
            loanUpdatePage.setEndDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
            loanUpdatePage.setPrincipalInput('principal'),
            loanUpdatePage.setAmountInput('5'),
            loanUpdatePage.customerSelectLastOption()
        ]);
        expect(await loanUpdatePage.getLoanIdInput()).to.eq('5');
        expect(await loanUpdatePage.getStartDateInput()).to.contain('2001-01-01T02:30');
        expect(await loanUpdatePage.getEndDateInput()).to.contain('2001-01-01T02:30');
        expect(await loanUpdatePage.getPrincipalInput()).to.eq('principal');
        expect(await loanUpdatePage.getAmountInput()).to.eq('5');
        await loanUpdatePage.save();
        expect(await loanUpdatePage.getSaveButton().isPresent()).to.be.false;

        expect(await loanComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
    });

    it('should delete last Loan', async () => {
        const nbButtonsBeforeDelete = await loanComponentsPage.countDeleteButtons();
        await loanComponentsPage.clickOnLastDeleteButton();

        loanDeleteDialog = new LoanDeleteDialog();
        expect(await loanDeleteDialog.getDialogTitle()).to.eq('Are you sure you want to delete this Loan?');
        await loanDeleteDialog.clickOnConfirmButton();

        expect(await loanComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    });

    after(async () => {
        await navBarPage.autoSignOut();
    });
});
