
describe('TerraOffRoad App', () => {
  it('should launch and show the home screen', async () => {
    // Wait for app to load on physical device
    await browser.pause(8000);

    // Look for the map tab icon (should be visible by default)
    const mapTab = await $('~map-screen-tab');

    // Will fail loudly with a clear message if not found
    await expect(mapTab).toBeExisting({
      message: 'map-screen-tab not found — is the app really launched?'
    });

    console.log('TerraOffRoad launched successfully — bottom tabs are visible!');
  });
});