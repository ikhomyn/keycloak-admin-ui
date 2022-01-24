import ClientScopesDetailsSettingPage from "../client_scopes_details_tabs/ClientScopesDetailsSettingPage";
import ClientScopesDetailsMapperPage from "../client_scopes_details_tabs/ClientScopesDetailsMappersPage";
import ClientScopesDetailsScopePage from "../client_scopes_details_tabs/ClientScopesDetailsScopePage";
import BaseTabComponent from "../../../components/BaseTabComponent";

export default class ClientScopesTabComponent extends BaseTabComponent {
  settingsTabText = "Settings";
  mappersTabText = "Mappers";
  scopeTabText = "Scope";

  get settingsTab() {
    return this.parentElement.find("button").contains(this.settingsTabText);
  }

  get mappersTab() {
    return this.parentElement.find("button").contains(this.mappersTabText);
  }

  get scopeTab() {
    return this.parentElement.find("button").contains(this.scopeTabText);
  }

  goToSettingsTab() {
    this.settingsTab.click();

    return new ClientScopesDetailsSettingPage();
  }

  goToMappersTab() {
    this.mappersTab.click();

    return new ClientScopesDetailsMapperPage();
  }

  goToScopeTab() {
    this.scopeTab.click();

    return new ClientScopesDetailsScopePage();
  }
}
