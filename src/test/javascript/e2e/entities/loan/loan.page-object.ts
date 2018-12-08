import { element, by, ElementFinder } from 'protractor';

export class LoanComponentsPage {
    createButton = element(by.id('jh-create-entity'));
    deleteButtons = element.all(by.css('jhi-loan div table .btn-danger'));
    title = element.all(by.css('jhi-loan div h2#page-heading span')).first();

    async clickOnCreateButton() {
        await this.createButton.click();
    }

    async clickOnLastDeleteButton() {
        await this.deleteButtons.last().click();
    }

    async countDeleteButtons() {
        return this.deleteButtons.count();
    }

    async getTitle() {
        return this.title.getText();
    }
}

export class LoanUpdatePage {
    pageTitle = element(by.id('jhi-loan-heading'));
    saveButton = element(by.id('save-entity'));
    cancelButton = element(by.id('cancel-save'));
    loanIdInput = element(by.id('field_loanId'));
    startDateInput = element(by.id('field_startDate'));
    endDateInput = element(by.id('field_endDate'));
    principalInput = element(by.id('field_principal'));
    amountInput = element(by.id('field_amount'));
    customerSelect = element(by.id('field_customer'));

    async getPageTitle() {
        return this.pageTitle.getText();
    }

    async setLoanIdInput(loanId) {
        await this.loanIdInput.sendKeys(loanId);
    }

    async getLoanIdInput() {
        return this.loanIdInput.getAttribute('value');
    }

    async setStartDateInput(startDate) {
        await this.startDateInput.sendKeys(startDate);
    }

    async getStartDateInput() {
        return this.startDateInput.getAttribute('value');
    }

    async setEndDateInput(endDate) {
        await this.endDateInput.sendKeys(endDate);
    }

    async getEndDateInput() {
        return this.endDateInput.getAttribute('value');
    }

    async setPrincipalInput(principal) {
        await this.principalInput.sendKeys(principal);
    }

    async getPrincipalInput() {
        return this.principalInput.getAttribute('value');
    }

    async setAmountInput(amount) {
        await this.amountInput.sendKeys(amount);
    }

    async getAmountInput() {
        return this.amountInput.getAttribute('value');
    }

    async customerSelectLastOption() {
        await this.customerSelect
            .all(by.tagName('option'))
            .last()
            .click();
    }

    async customerSelectOption(option) {
        await this.customerSelect.sendKeys(option);
    }

    getCustomerSelect(): ElementFinder {
        return this.customerSelect;
    }

    async getCustomerSelectedOption() {
        return this.customerSelect.element(by.css('option:checked')).getText();
    }

    async save() {
        await this.saveButton.click();
    }

    async cancel() {
        await this.cancelButton.click();
    }

    getSaveButton(): ElementFinder {
        return this.saveButton;
    }
}

export class LoanDeleteDialog {
    private dialogTitle = element(by.id('jhi-delete-loan-heading'));
    private confirmButton = element(by.id('jhi-confirm-delete-loan'));

    async getDialogTitle() {
        return this.dialogTitle.getText();
    }

    async clickOnConfirmButton() {
        await this.confirmButton.click();
    }
}
