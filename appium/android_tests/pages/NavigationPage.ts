import BasePage from "./BasePage";

export default class NavigationPage extends BasePage {
 
  private readonly MAP_TAB = "~map-screen-tab";
  private readonly GEAR_TAB = "~gear-tab";
  private readonly WEATHER_TAB = "~weather-tab";
  private readonly GEAR_SCREEN = "~gear-screen";
  private readonly WEATHER_SCREEN = "~weather-screen";

  async clickMapTab() {
    await this.clickElement(this.MAP_TAB);
  }

  async clickGearTab() {
    await this.clickElement(this.GEAR_TAB);
  }

  async clickWeatherTab() {
    await this.clickElement(this.WEATHER_TAB);
  }

  async verifyMapScreenDisplayed() {
    await this.waitForElementToBeDisplayed(this.MAP_TAB);
  }

  async verifyGearScreenDisplayed() {
    await this.waitForElementToBeDisplayed(this.GEAR_SCREEN);
  }

  async verifyWeatherScreenDisplayed() {
    await this.waitForElementToBeDisplayed(this.WEATHER_SCREEN);
  }
}