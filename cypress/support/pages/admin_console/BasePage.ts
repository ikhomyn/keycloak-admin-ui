import BaseNoSearchResultsComponent from "./components/BaseNoSearchResultsComponent";
import SidebarPage from "./SidebarPage";

export abstract class BasePage {
  private url: RegExp;
  public cmpSidebarMenu: SidebarPage = new SidebarPage();
  public cmpNoSearchResults: BaseNoSearchResultsComponent =
    new BaseNoSearchResultsComponent();

  constructor(url: RegExp) {
    this.url = url;
  }

  abstract goToPage(): this;

  isCurrentPage(): this {
    cy.url().should("match", RegExp(this.url));

    return this;
  }
}
