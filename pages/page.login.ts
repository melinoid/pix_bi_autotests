import { type Page, type Locator, expect } from '@playwright/test';
import CommonPage from './page.common';

/** Локаторы и функции для стр. авторизации. */
export default class LoginPage {
  readonly page: Page;
  readonly commonPage: CommonPage;

  readonly versionArticle: Locator;

  readonly loginBlock: Locator;
  readonly loginForm: {
    readonly loginInput: Locator;

    readonly passwordInput: Locator;
    readonly hidePasswordBtn: Locator;
    readonly showPasswordBtn: Locator;

    readonly submitBtn: Locator;

    readonly loader: Locator;
  };

  constructor(page: Page, commonPage: CommonPage) {
    this.page = page;
    this.commonPage = commonPage;

    this.versionArticle = page.locator("//article[contains(@class, 'LoginPage_versionText')]");

    this.loginBlock = page.locator("//div[contains(@class, 'LoginPage_blockWrapper')]");
    this.loginForm = {
      loginInput: page.locator('input[id=login_username]'),

      passwordInput: page.locator('input[id=login_password]'),
      hidePasswordBtn: page.locator('span.ant-input-password span.anticon-eye'),
      showPasswordBtn: page.locator('span.ant-input-password span.anticon-eye-invisible'),

      submitBtn: page.locator('button[type=submit]'),

      loader: page.locator("img[src*='data:image/gif']"),
    };
  }

  async authorization(user: { username: string; password: string }) {
    await this.loginForm.loginInput.fill(user.username);
    await this.loginForm.passwordInput.fill(user.password);
    await this.loginForm.submitBtn.click();

    await expect(this.loginForm.loader).toBeHidden();
    await this.page.waitForLoadState('load');
    await expect(this.commonPage.mainLoader).toBeHidden();

    const expLicWarn = this.page.locator(
      '.ant-notification-notice:has-text("Срок действия некоторых лицензии") a[aria-label="Close"]'
    );
    if (await expLicWarn.isVisible()) {
      await expLicWarn.click();
      await expect(expLicWarn).toBeHidden();
    }
  }

  async goToAuthorizedPage(path: string, user: { username: string; password: string }) {
    await this.page.goto(path);
    await this.authorization(user);
    expect(this.commonPage.sideMenu.logoutBtn);
  }
}
