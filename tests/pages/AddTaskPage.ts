import { Page, expect } from '@playwright/test';

export class AddTaskPage {
  constructor(private page: Page) {}

  async open() {
    await this.page.goto('http://localhost:5173/add');

    await expect(
      this.page.getByPlaceholder('Enter task name')
    ).toBeVisible();
  }

  async fillTask(name: string, desc: string) {
    await this.page.getByPlaceholder('Enter task name').fill(name);
    await this.page.getByPlaceholder('Enter task description').fill(desc);
  }

  async save() {
    await this.page
      .getByRole('button', { name: /create task/i })
      .click();

    await this.page.waitForURL('**/');
  }
}