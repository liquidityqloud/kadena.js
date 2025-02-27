import type { Page } from '@playwright/test';

export class MockHelper {
  private readonly _page: Page;
  public constructor(page: Page) {
    this._page = page;
  }

  public async mockResponse(
    uri: string | RegExp,
    response: object,
  ): Promise<void> {
    await this._page.route(uri, async (route) => {
      const json = response;
      await route.fulfill({ json });
    });
  }
}
