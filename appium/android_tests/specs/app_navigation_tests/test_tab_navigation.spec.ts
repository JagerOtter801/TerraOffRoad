import NavigationPage from "../../pages/NavigationPage";

describe("Navigation Tests", () => {
  let navPage: NavigationPage;

  beforeEach(async () => {
    navPage = new NavigationPage();
    await navPage.verifyMapScreenDisplayed(); 
  });

  it("should navigate to Map Screen tab", async () => {
    await navPage.clickMapTab();
    await navPage.verifyMapScreenDisplayed();
  });

  it("should navigate to Gear tab", async () => {
    await navPage.clickGearTab();
    await navPage.verifyGearScreenDisplayed();
  });

  it("should navigate to Weather tab and scroll", async () => {
    await navPage.clickWeatherTab();
    await navPage.verifyWeatherScreenDisplayed();
    
    const found = await navPage.swipeDownUntilElementIsVisible("~weather-screen");
    expect(found).toBe(true);
  });

  // Navigate back to Map tab after Navigation tests run
  afterEach(async () => {
    await navPage.clickMapTab(); 
  });
});