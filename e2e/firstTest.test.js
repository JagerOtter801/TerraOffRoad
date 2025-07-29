const { device, expect, element, by, waitFor } = require('detox');

describe('TerraOffRoad App', () => {
  it('should show welcome screen', async () => {
    // Wait for the app to load
    await waitFor(element(by.id('welcome-screen')))
      .toBeVisible()
      .withTimeout(10000);
    
    // Check if welcome screen is visible
    await expect(element(by.id('welcome-screen'))).toBeVisible();
  });
});