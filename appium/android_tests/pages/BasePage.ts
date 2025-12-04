export default class BasePage {
  public static readonly TIMEOUT: number = 10000;

  async waitForElementToBeDisplayed(
    selector: string,
    timeout = BasePage.TIMEOUT
  ) {
    const element = await $(selector);
    await element.waitForDisplayed({ timeout });
    return element;
  }

  async clickElement(selector: string, timeout = BasePage.TIMEOUT) {
    const element = await this.waitForElementToBeDisplayed(selector, timeout);
    await element.click();
  }

  async verifyOptionalElementIsDisplayed(
    selector: string,
    timeout = BasePage.TIMEOUT
  ) {
    try {
      const element = await this.waitForElementToBeDisplayed(
        selector,
        BasePage.TIMEOUT
      );
      return element.isDisplayed();
    } catch {
      return false;
    }
  }

  async swipe(
    direction: 'up' | 'down' | 'left' | 'right',
    selector?: string,
    distance: number = 0.4,
    duration: number = 500
  ): Promise<void> {
    let startX: number, startY: number, endX: number, endY: number;

    if (selector) {
      // Swipe on specific element
      const element = await $(selector);
      const location = await element.getLocation();
      const size = await element.getSize();
      const centerX = location.x + size.width / 2;
      const centerY = location.y + size.height / 2;

      switch (direction) {
        case 'down':
          startX = centerX;
          startY = location.y + size.height * 0.3;
          endX = centerX;
          endY = location.y + size.height * (0.3 + distance);
          break;
        case 'up':
          startX = centerX;
          startY = location.y + size.height * 0.7;
          endX = centerX;
          endY = location.y + size.height * (0.7 - distance);
          break;
        case 'left':
          startX = location.x + size.width * 0.7;
          startY = centerY;
          endX = location.x + size.width * (0.7 - distance);
          endY = centerY;
          break;
        case 'right':
          startX = location.x + size.width * 0.3;
          startY = centerY;
          endX = location.x + size.width * (0.3 + distance);
          endY = centerY;
          break;
      }
    } else {
      // Swipe on entire screen
      const { width, height } = await driver.getWindowSize();
      const centerX = width / 2;
      const centerY = height / 2;

      switch (direction) {
        case 'down':
          startX = centerX;
          startY = height * 0.3;
          endX = centerX;
          endY = height * (0.3 + distance);
          break;
        case 'up':
          startX = centerX;
          startY = height * 0.7;
          endX = centerX;
          endY = height * (0.7 - distance);
          break;
        case 'left':
          startX = width * 0.7;
          startY = centerY;
          endX = width * (0.7 - distance);
          endY = centerY;
          break;
        case 'right':
          startX = width * 0.3;
          startY = centerY;
          endX = width * (0.3 + distance);
          endY = centerY;
          break;
      }
    }

    await driver.performActions([
      {
        type: "pointer",
        id: "finger1",
        parameters: { pointerType: "touch" },
        actions: [
          { type: "pointerMove", duration: 0, x: startX, y: startY },
          { type: "pointerDown", button: 0 },
          { type: "pointerMove", duration, x: endX, y: endY },
          { type: "pointerUp", button: 0 },
        ],
      },
    ]);
  }
}