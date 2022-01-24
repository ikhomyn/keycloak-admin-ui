export default class BaseNoSearchResultsComponent {
  private parentSelector: string;

  constructor() {
    this.parentSelector = "empty-state";
  }

  get parentElement() {
    return cy.findByTestId(this.parentSelector);
  }
}
