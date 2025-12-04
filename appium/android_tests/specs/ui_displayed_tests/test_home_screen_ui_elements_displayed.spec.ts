import BasePage from "../../pages/BasePage";
import HomeScreenPage from "../../pages/HomeScreenPage";

describe("HomeScreen UI Tests:", () => {
  const homePage = new HomeScreenPage();

  it("Testing Map Screen Tab Presence", async () => {
    await browser.pause(BasePage.TIMEOUT);
    await homePage.verifyMapTabExists();
  });

  it("Testing Points of Interest Tab Presence", async () => {
    await homePage.verifyPoiTabExists();
  });

  it("Testing Gear Tab Presence", async () => {
    await homePage.verifyGearTabExists();
  });

  it("Testing Weather Tab Presence", async () => {
    await homePage.verifyWeatherTabExists();
  });
});