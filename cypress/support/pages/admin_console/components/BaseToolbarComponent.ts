export default class BaseToolbarComponent {
  private parentSelector;
  private searchInputSelector;
  private searchButtonSelector;
  private primaryButtonSelector;

  constructor() {
    this.parentSelector = "section > div[class='pf-c-toolbar']:nth-child(1)";
    this.searchInputSelector = ".pf-c-toolbar__item [type='search']";
    this.searchButtonSelector = "button.pf-m-control";
    this.primaryButtonSelector = ".pf-c-button.pf-m-primary";
  }

  get parentElement() {
    return cy.get(this.parentSelector);
  }

  get searchInput() {
    return cy.get(this.parentSelector).find(this.searchInputSelector);
  }

  get searchButton() {
    return cy.get(this.parentSelector).find(this.searchButtonSelector);
  }

  get primaryButton() {
    return cy.get(this.parentSelector).find(this.primaryButtonSelector);
  }

  searchFor(name: string) {
    this.searchInput.clear().type(name);
    this.searchButton.click();

    return this;
  }
}
