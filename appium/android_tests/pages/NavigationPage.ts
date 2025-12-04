import BasePage from "./BasePage";

 class NavigationPage extends BasePage {
  private mapTab = '~map-screen-tab';
  private gearTab = '~gear-tab';
  private weatherTab = '~weather-tab';
  private gearScreen = '~gear-screen';
  private weatherScreen = '~weather-screen';

  async clickMapTab() {
    await this.clickElement(this.mapTab);
  }

  async clickGearTab() {
    await this.clickElement(this.gearTab);
  }

  async clickWeatherTab() {
    await this.clickElement(this.weatherTab);
  }

  async verifyGearScreenDisplayed() {
    return await this.waitForElementToBeDisplayed(this.gearScreen);
  }

  async verifyWeatherScreenDisplayed() {
    return await this.waitForElementToBeDisplayed(this.weatherScreen);
  }
}

export default NavigationPage;