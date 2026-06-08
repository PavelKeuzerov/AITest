import { test } from "@playwright/test";

import { TodoPage } from "../pages/TodoPage";
import { AddTaskPage } from "../pages/AddTaskPage";

import { taskData } from "../data/task.data";

test.describe("Todo App", () => {
  let todo: TodoPage;
  let add: AddTaskPage;

  test.beforeEach(async ({ page }) => {
    todo = new TodoPage(page);
    add = new AddTaskPage(page);

    await todo.open();
  });

  test("TC-001 Create task", async () => {
    await todo.createTask(
      add,
      taskData.create.title,
      taskData.create.description
    );

    await todo.expectTaskVisible(
      taskData.create.title
    );
  });

  test("TC-002 Edit task", async () => {
    await todo.createTask(
      add,
      taskData.edit.originalTitle,
      taskData.edit.description
    );

    await todo.openMoreMenu(
      taskData.edit.originalTitle
    );

    await todo.clickEdit();

    await todo.editTask(
      taskData.edit.updatedTitle
    );

    await todo.saveEdit();

    await todo.expectTaskVisible(
      taskData.edit.updatedTitle
    );
  });

  test("TC-003 Complete task", async () => {
    await todo.createTask(
      add,
      taskData.complete.title,
      taskData.complete.description
    );

    await todo.markAsDone(
      taskData.complete.title
    );

    await todo.expectTaskCompleted(
      taskData.complete.title
    );
  });

  test("TC-004 Delete task", async () => {
    await todo.createTask(
      add,
      taskData.delete.title,
      taskData.delete.description
    );

    await todo.deleteTask(
      taskData.delete.title
    );

    await todo.confirmDelete();

    await todo.expectTaskNotVisible(
      taskData.delete.title
    );
  });
});