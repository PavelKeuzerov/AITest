import { Page } from '@playwright/test';

export class BasePage {
  constructor(protected page: Page) {}

  async visit(url: string) {
    await this.page.goto(url);
  }
}