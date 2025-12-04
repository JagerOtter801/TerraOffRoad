import BasePage from "../../pages/BasePage";


// Test HomeScreen UI elements exist 
export default describe("HomeScreen UI_Tests", () => {

  it("Testing Map Screen Tab Presence", async () => {
    await browser.pause(BasePage.TIMEOUT);
    const mapTab = await $("~map-screen-tab");

    await expect(mapTab).toBeExisting({
      message: "map-screen-tab not found — is the app really launched?",
    });
    console.log(
      "TerraOffRoad launched successfully — bottom tabs are visible!"
    );
  });

  it("Testing Points of Interest Tab Presence", async () => {
    const poiTab = await $(`~points-of-interest-tab`);
    await expect(poiTab).toBeExisting({
      message: "points-of-interest-tab not found",
    });
    console.log("Points of Interest tab is present on the Home Screen");
  });
});

it("Testing Gear Tab Presence", async () => {
  const gearTab = await $(`~gear-tab`);
  await expect(gearTab).toBeExisting({
    message: "gear-tab not found",
  });
  console.log("Gear tab is present on the Home Screen");
}
);

it("Testing if Weather Tab is Present", async ()=>{
  const weatherTab = await $(`~weather-tab`);
  await expect(weatherTab).toBeExisting({
    message: "weather-tab not found",
  });
  console.log("Weather tab is present on the Home Screen");
});


