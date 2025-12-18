import HomeScreenPage from "../../pages/HomeScreenPage";

describe("HomeScreen UI Tests", () => {
  let homePage: HomeScreenPage;

  beforeEach(async () => {
    homePage = new HomeScreenPage();
    await homePage.waitForHomeScreenToLoad();
  });

  it("should display Map Screen tab", async () => {
    await homePage.verifyMapTabExists();
  });

  it("should display Points of Interest tab", async () => {
    await homePage.verifyPoiTabExists();
  });

  it("should display Gear tab", async () => {
    await homePage.verifyGearTabExists();
  });

  it("should display Weather tab", async () => {
    await homePage.verifyWeatherTabExists();
  });
});