import ClientsPage from "../ClientsPage";
import InitialAccessTokenTab from "../InitialAccessTokenTab";
import ParentTabComponent from "../../../components/BaseTabComponent";

export default class ClientsTabComponent extends ParentTabComponent {
  clientListTabText = "Clients list";
  initialAccessTokenTabText = "Initial access token";

  get clientsListTab() {
    return this.parentElement.find("button").contains(this.clientListTabText);
  }

  get initialAccessTokenTab() {
    return this.parentElement
      .find("button")
      .contains(this.initialAccessTokenTabText);
  }

  goToClientsListTab() {
    this.clientsListTab.click();

    return new ClientsPage();
  }

  goToInitialAccessTokenTab() {
    this.initialAccessTokenTab.click();

    return new InitialAccessTokenTab();
  }
}
