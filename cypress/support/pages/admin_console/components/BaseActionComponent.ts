export default class BaseActionToolbarComponent {
  parentSelector: string;

  constructor() {
    this.parentSelector = "[data-testid='action-dropdown']";
  }

  get parentElement() {
    return cy.get(this.parentSelector);
  }

  get dropdownButton() {
    return this.parentElement.find("button");
  }
}
