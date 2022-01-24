export default class BaseTabComponent {
  private parentSelector: string;
  private activeTabSelector = ".pf-c-tabs__item.pf-m-current";

  constructor() {
    this.parentSelector = ".pf-c-tabs";
  }

  get parentElement() {
    return cy.get(this.parentSelector);
  }

  get activeTab() {
    return cy
      .get(this.parentSelector)
      .find(this.activeTabSelector)
      .find("button");
  }
}
