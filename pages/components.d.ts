import { Locator } from '@playwright/test';

declare namespace Components {
  type InputField = {
    readonly label: Locator;
    readonly input: Locator;
  };

  type TextareaField = {
    readonly label: Locator;
    readonly textarea: Locator;
  };

  type SelectorField = InputField & {
    readonly dropdown: Locator;
  };

  type Toggle = {
    readonly label: Locator;
    readonly toggle: Locator;
  };

  type Radio = {
    readonly label: Locator;
    readonly radioBtn: Locator;
  };

  type CheckBox = {
    readonly label: Locator;
    readonly checkbox: Locator;
  };

  type Table = {
    readonly head: Locator;
    readonly body: Locator;
  };

  type SearchField = {
    readonly openBtn: Locator;
    readonly input: Locator;
    readonly closeBtn: Locator;
  };

  type Pagination = {
    readonly prevPageBtn: Locator;
    readonly nextPageBtn: Locator;
    readonly optionSelect: Locator;
    readonly pageNumField: InputField;
  };

  type DeleteModal = {
    readonly title: Locator;
    readonly closeBtn: Locator;
    readonly text: Locator;
    readonly cancelBtn: Locator;
    readonly applyBtn: Locator;
  };
}
