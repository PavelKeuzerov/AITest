import { expect, Page } from "@playwright/test";
import { AddTaskPage } from "./AddTaskPage";

export class TodoPage {
  constructor(public page: Page) {}

  async open() {
    await this.page.goto("http://localhost:5173/");
  }

  async clickAddTask() {
    const btn = this.page.locator(
      'button[aria-label="Add Task"]'
    );

    await expect(btn).toBeVisible();

    await btn.click({ force: true });

    await this.page.waitForURL("**/add");
  }

  async createTask(
    addPage: AddTaskPage,
    title: string,
    description: string
  ) {
    await this.clickAddTask();

    await addPage.fillTask(title, description);

    await addPage.save();
  }

  async expectTaskVisible(taskName: string) {
    const task = this.page
      .locator('[data-testid="task-container"]')
      .filter({ hasText: taskName });

    await expect(task).toBeVisible();
  }

  async expectTaskNotVisible(taskName: string) {
    const task = this.page
      .locator('[data-testid="task-container"]')
      .filter({ hasText: taskName });

    await expect(task).toHaveCount(0);
  }

  async openMoreMenu(taskName: string) {
    const task = this.page
      .locator('[data-testid="task-container"]')
      .filter({ hasText: taskName })
      .first();

    await expect(task).toBeVisible();

    const menuBtn = task.getByRole("button", {
      name: /task menu/i,
    });

    await menuBtn.click({ force: true });

    await expect(
      this.page.getByRole("menu")
    ).toBeVisible();
  }

  async clickEdit() {
    await this.page
      .getByRole("menuitem", { name: /edit/i })
      .click();
  }

  async editTask(newName: string) {
    const input = this.page.locator(
      'input[name="name"]'
    );

    await input.clear();

    await input.fill(newName);
  }

  async saveEdit() {
    await this.page
      .getByRole("button", {
        name: /save|update/i,
      })
      .click();

    await this.page.waitForURL("**/");
  }

  async deleteTask(taskName: string) {
    await this.openMoreMenu(taskName);

    await this.page
      .getByRole("menuitem", {
        name: /delete/i,
      })
      .click();
  }

  async confirmDelete() {
    const dialog = this.page.getByRole("dialog");

    await expect(dialog).toBeVisible();

    await dialog
      .getByRole("button", {
        name: /confirm delete/i,
      })
      .click();

    await expect(dialog).toBeHidden();
  }

  async markAsDone(taskName: string) {
    await this.openMoreMenu(taskName);

    await this.page
      .getByRole("menuitem", {
        name: /mark as done/i,
      })
      .click();
  }

  async expectTaskCompleted(taskName: string) {
    const task = this.page
      .locator('[data-testid="task-container"]')
      .filter({ hasText: taskName });

    await expect(
      task.getByTestId("DoneRoundedIcon")
    ).toBeVisible();
  }
}