import BasePage from "../../pages/BasePage";
import NavigationPage from "../../pages/NavigationPage";

describe("Navigation Tests", () => {
  const navPage = new NavigationPage();

  it("Testing Map Screen Tab Selection", async () => {
    await browser.pause(BasePage.TIMEOUT);

    const mapTab = await $("~map-screen-tab");
    await expect(mapTab).toBeExisting({
      message: "map-screen-tab not found — is the app really launched?",
    });

    await navPage.clickMapTab();

    await expect(mapTab).toBeExisting({
      message: "map-screen-tab not found after click",
    });
  });

  it("Testing Gear Tab Selection", async () => {
    const gearTab = await $(`~gear-tab`);
    await expect(gearTab).toBeExisting({
      message: "gear-tab not found",
    });

    await navPage.clickGearTab();
    await navPage.verifyGearScreenDisplayed();
  });

  it("Testing Weather Tab Selection", async () => {
    const weatherTab = await $(`~weather-tab`);
    await expect(weatherTab).toBeExisting({
      message: "weather-tab not found",
    });

    await navPage.clickWeatherTab();
    await navPage.verifyWeatherScreenDisplayed();
    await navPage.swipeDownUntilElementIsVisible("~weather-screen");
  });

  it("Cleanup - Return to Map Screen", async () => {
    await navPage.clickMapTab();
  });
});
