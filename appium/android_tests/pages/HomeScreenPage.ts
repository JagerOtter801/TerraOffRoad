import BasePage from "./BasePage";

export default class HomeScreenPage extends BasePage {
  private readonly MAP_TAB = "~map-screen-tab";
  private readonly POI_TAB = "~poi-tab";
  private readonly GEAR_TAB = "~gear-tab";
  private readonly WEATHER_TAB = "~weather-tab";
  private readonly HOME_SCREEN = "~home-screen"; 

  async waitForHomeScreenToLoad() {
    await this.waitForElementToBeDisplayed(this.HOME_SCREEN); 
  }

  async verifyMapTabExists() {
    await this.waitForElementToBeDisplayed(this.MAP_TAB);
  }

  async verifyPoiTabExists() {
    await this.waitForElementToBeDisplayed(this.POI_TAB);
  }

  async verifyGearTabExists() {
    await this.waitForElementToBeDisplayed(this.GEAR_TAB);
  }

  async verifyWeatherTabExists() {
    await this.waitForElementToBeDisplayed(this.WEATHER_TAB);
  }
}