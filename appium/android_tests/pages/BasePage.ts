export default class BasePage {
    public static readonly TIMEOUT: number = 10000;

    protected async waitForElementToBeDisplayed(selector: string, timeout = BasePage.TIMEOUT) {
        const element = await $(selector);
        await element.waitForDisplayed({ timeout });
        return element;
    }

    protected async clickElement(selector: string, timeout = BasePage.TIMEOUT) {
        const element = await this.waitForElementToBeDisplayed(selector, timeout);
        await element.click();
    }

    protected async verifyOptionalElementIsDisplayed(selector: string, timeout = BasePage.TIMEOUT){
        try {
        const element = await this.waitForElementToBeDisplayed(selector, BasePage.TIMEOUT);
        return element.isDisplayed();
    } catch {
        return false;
    }
}
    
}