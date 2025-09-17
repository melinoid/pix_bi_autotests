import { test as base } from '@playwright/test';
import { data } from '../data/data.common';
import Helper from './helper';
import CommonPage from '../pages/page.common';
import AdminSecurityRulesPage from '../pages/adminPages/page.adminSecurityRules';
import ApplicationsPage from '../pages/adminPages/page.applications';
import DirectoriesPage from '../pages/adminPages/page.directories';
import EmailReportsPage from '../pages/adminPages/page.emailReports';
import GeoserversPage from '../pages/adminPages/page.geoservers';
import GroupsPage from '../pages/adminPages/page.groups';
import LicenseBasePage from '../pages/adminPages/page.licenseBase';
import LicenseProPage from '../pages/adminPages/page.licensePro';
import LicenseRulesPage from '../pages/adminPages/page.licenseRules';
import LicensiesPage from '../pages/adminPages/page.licensies';
import LoginPage from '../pages/page.login';
import LogsPage from '../pages/adminPages/page.logs';
import MainPage from '../pages/page.main';
import ModifiersAuditPage from '../pages/adminPages/page.modifiersAudit';
import RlsOmitPage from '../pages/adminPages/page.rlsOmit';
import SecurityRulesPage from '../pages/adminPages/page.securityRules';
import SettingsPage from '../pages/adminPages/page.settings';
import SharedLinksPage from '../pages/adminPages/page.sharedLinks';
import SpecialApiPage from '../pages/adminPages/page.specialApi';
import ThemesPage from '../pages/adminPages/page.themes';
import UsefulLinksPage from '../pages/adminPages/page.usefulLinks';
import UsersImportPage from '../pages/adminPages/page.usersImport';
import UsersPage from '../pages/adminPages/page.users';

type Fixtures = {
  helper: Helper;
  commonPage: CommonPage;
  aAdminSecurityRulesPage: AdminSecurityRulesPage;
  applicationsPage: ApplicationsPage;
  directoriesPage: DirectoriesPage;
  emailReportsPage: EmailReportsPage;
  geoserversPage: GeoserversPage;
  groupsPage: GroupsPage;
  licenseBasePage: LicenseBasePage;
  licenseProPage: LicenseProPage;
  licenseRulesPage: LicenseRulesPage;
  licensiesPage: LicensiesPage;
  loginPage: LoginPage;
  logsPage: LogsPage;
  mainPage: MainPage;
  modifiersAuditPage: ModifiersAuditPage;
  rlsOmitPage: RlsOmitPage;
  securityRulesPage: SecurityRulesPage;
  settingsPage: SettingsPage;
  sharedLinksPage: SharedLinksPage;
  specialApiPage: SpecialApiPage;
  themesPage: ThemesPage;
  usefulLinksPage: UsefulLinksPage;
  usersImportPage: UsersImportPage;
  usersPage: UsersPage;
  data: typeof data;
};

export const test = base.extend<Fixtures>({
  helper: async ({}, use) => {
    await use(new Helper());
  },
  commonPage: async ({ page }, use) => {
    await use(new CommonPage(page));
  },
  aAdminSecurityRulesPage: async ({ page }, use) => {
    await use(new AdminSecurityRulesPage(page));
  },
  applicationsPage: async ({ page }, use) => {
    await use(new ApplicationsPage(page));
  },
  directoriesPage: async ({ page }, use) => {
    await use(new DirectoriesPage(page));
  },
  emailReportsPage: async ({ page }, use) => {
    await use(new EmailReportsPage(page));
  },
  geoserversPage: async ({ page }, use) => {
    await use(new GeoserversPage(page));
  },
  groupsPage: async ({ page }, use) => {
    await use(new GroupsPage(page));
  },
  licenseBasePage: async ({ page }, use) => {
    await use(new LicenseBasePage(page));
  },
  licenseProPage: async ({ page }, use) => {
    await use(new LicenseProPage(page));
  },
  licenseRulesPage: async ({ page }, use) => {
    await use(new LicenseRulesPage(page));
  },
  licensiesPage: async ({ page }, use) => {
    await use(new LicensiesPage(page));
  },
  loginPage: async ({ page, commonPage }, use) => {
    await use(new LoginPage(page, commonPage));
  },
  logsPage: async ({ page }, use) => {
    await use(new LogsPage(page));
  },
  mainPage: async ({ page }, use) => {
    await use(new MainPage(page));
  },
  modifiersAuditPage: async ({ page }, use) => {
    await use(new ModifiersAuditPage(page));
  },
  rlsOmitPage: async ({ page }, use) => {
    await use(new RlsOmitPage(page));
  },
  securityRulesPage: async ({ page }, use) => {
    await use(new SecurityRulesPage(page));
  },
  settingsPage: async ({ page }, use) => {
    await use(new SettingsPage(page));
  },
  sharedLinksPage: async ({ page }, use) => {
    await use(new SharedLinksPage(page));
  },
  specialApiPage: async ({ page }, use) => {
    await use(new SpecialApiPage(page));
  },
  themesPage: async ({ page }, use) => {
    await use(new ThemesPage(page));
  },
  usefulLinksPage: async ({ page }, use) => {
    await use(new UsefulLinksPage(page));
  },
  usersImportPage: async ({ page }, use) => {
    await use(new UsersImportPage(page));
  },
  usersPage: async ({ page }, use) => {
    await use(new UsersPage(page));
  },
  data,
});
