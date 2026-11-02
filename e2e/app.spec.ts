import { expect, test } from "@playwright/test";

test.describe("Nuptiae E2E Suite", () => {
  test("GET /api/health returns 200 OK", async ({ request }) => {
    const res = await request.get("/api/health");
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe("ok");
  });

  test("Public home page loads and Cookie Banner can be accepted", async ({
    page,
  }) => {
    await page.goto("/it");
    await expect(page).toHaveURL(/\/it/);

    const acceptBtn = page.getByRole("button", { name: "Accetta" });
    if (await acceptBtn.isVisible()) {
      await acceptBtn.click();
      await expect(acceptBtn).toBeHidden();
    }
  });

  test("Unauthenticated visitor is redirected from /it/admin to /it/admin/login", async ({
    page,
  }) => {
    await page.goto("/it/admin");
    await expect(page).toHaveURL(/\/it\/admin\/login/);
    await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
  });

  test("Admin login shows error message on invalid credentials", async ({
    page,
  }) => {
    await page.goto("/it/admin/login");
    await page.getByLabel("Username").fill("wrong-user");
    await page.getByLabel("Password").fill("wrong-password");
    await page.getByRole("button", { name: "Accedi" }).click();

    await expect(page.getByText(/Invalid credentials|Errore/i)).toBeVisible();
  });

  test("Unauthorized guest access without token redirects to /it/error", async ({
    page,
  }) => {
    await page.goto("/it/participant/507f1f77bcf86cd799439011");
    await expect(page).toHaveURL(/\/it\/error/);
    await expect(
      page.getByRole("heading", { name: "Accesso non autorizzato" })
    ).toBeVisible();
  });
});
