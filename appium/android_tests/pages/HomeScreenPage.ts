import BasePage from "./BasePage";
class HomeScreenPage extends BasePage {
  private mapTab = "~map-screen-tab";
  private poiTab = "~points-of-interest-tab";
  private gearTab = "~gear-tab";
  private weatherTab = "~weather-tab";

  async verifyMapTabExists() {
    return await this.waitForElementToBeDisplayed(this.mapTab);
  }

  async verifyPoiTabExists() {
    return await this.waitForElementToBeDisplayed(this.poiTab);
  }

  async verifyGearTabExists() {
    return await this.waitForElementToBeDisplayed(this.gearTab);
  }

  async verifyWeatherTabExists() {
    return await this.waitForElementToBeDisplayed(this.weatherTab);
  }
}

export default HomeScreenPage;