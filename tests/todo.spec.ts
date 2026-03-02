import { test, expect } from "@playwright/test";

test.describe("ToDo MVC UI Tests", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("https://todomvc.com/examples/react/dist/")
    })

    test("Create a ToDo Item and Check that it's in 'Activated' Tab", async ({ page }) => {
        await page.getByTestId("text-input").fill("Do Pilates"); //testid takes prescedent over role?
        await page.getByTestId("text-input").press("Enter");

        await expect(page.getByTestId("todo-item-label").filter({ hasText: "Pilates" })).toBeVisible();
        await page.getByRole("link", { name: "Active" }).click();
        await expect(page.getByTestId("todo-item-label").filter({ hasText: "Pilates" })).toBeVisible();
        await page.getByRole("link", { name: "Completed" }).click();
        await expect(page.getByTestId("todo-item-label").filter({ hasText: "Pilates" })).not.toBeVisible(); //or .toBeHidden
    })

    test("Mark Item as Completed and Check it it's in 'Completed' Tab", async ({ page }) => {
        await page.getByTestId("text-input").fill("Do Pilates");
        await page.getByTestId("text-input").press("Enter");
        await page.getByRole("listitem").filter({ hasText: "Pilates" }).getByTestId("todo-item-toggle").click()

        await expect(page.getByRole("listitem").filter({ hasText: "Pilates" })).toHaveClass("completed")
        await page.getByRole("link", { name: "Completed" }).click()
        await expect(page.getByTestId("todo-item-label").filter({ hasText: "Pilates" })).toBeVisible();

        await page.getByRole("link", { name: "Active" }).click()
        await expect(page.getByTestId("todo-item-label").filter({ hasText: "Pilates" })).not.toBeVisible();
    })

    test("Unmark list item so that it is not completed", async ({ page }) => {
        await page.getByTestId("text-input").fill("Do Pilates");
        await page.getByTestId("text-input").press("Enter");

        //mark as completed
        await page.getByRole("listitem").filter({ hasText: "Pilates" }).getByTestId("todo-item-toggle").click()
        await expect(page.getByRole("listitem").filter({ hasText: "Pilates" })).toHaveClass("completed")
        await page.getByRole("link", { name: "Completed" }).click()
        await expect(page.getByTestId("todo-item-label").filter({ hasText: "Pilates" })).toBeVisible();

        //should be unmarked
        await page.getByRole("listitem").filter({ hasText: "Pilates" }).getByTestId("todo-item-toggle").click()
        await page.getByRole("link", { name: "Active" }).click();
        await expect(page.getByTestId("todo-item-label").filter({ hasText: "Pilates" })).toBeVisible();

        //should no longer be on completed tab
        await page.getByRole("link", { name: "Completed" }).click()
        await expect(page.getByTestId("todo-item-label").filter({ hasText: "Pilates" })).not.toBeVisible();
        await page.getByRole("link", { name: "All" }).click()
        await expect(page.getByRole("listitem").filter({ hasText: "Pilates" })).not.toHaveClass("completed");
        await expect(page.getByRole("listitem").filter({ hasText: "Pilates" })).not.toContainClass("completed")
    })

    
})

