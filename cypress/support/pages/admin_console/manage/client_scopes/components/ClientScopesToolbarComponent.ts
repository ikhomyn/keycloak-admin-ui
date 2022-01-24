import BaseToolbarComponent from "../../../components/BaseToolbarComponent";

export enum Filter {
  Name = "Name",
  AssignedType = "Assigned type",
  Protocol = "Protocol",
}

export enum FilterAssignedType {
  AllTypes = "All types",
  Default = "Default",
  Optional = "Optional",
  None = "None",
}

export enum FilterProtocol {
  All = "All",
  SAML = "SAML",
  OpenID = "openid-connect", //TODO: text to be unified with item text
}

export default class ClientScopesToolbarComponent extends BaseToolbarComponent {
  private filterDropdownButtonSelector =
    ".pf-c-dropdown.keycloak__client-scopes__searchtype > button";
  private filterDropdownItemSelector = ".pf-c-dropdown__menu-item";

  private auxDropdownButtonSelector =
    ".pf-c-select.keycloak__client-scopes__searchtype > button";
  private auxDropdownItemSelector = ".pf-c-select__menu-item";

  private changeTypeDropdownButtonSelector = ".pf-c-select__toggle";

  private createClientScopeButton = "";
  private comboboxChangeTypeTo = "";
  private dropdownActionButtonSelector = ".pf-c-dropdown__toggle.pf-m-plain";
  private dropdownActionMenuItemButtonSelector = ".pf-c-dropdown__menu-item";

  get filterDropdownButton() {
    return this.parentElement.find(this.filterDropdownButtonSelector);
  }

  get filterDropdownItem() {
    return this.parentElement.find(this.filterDropdownItemSelector);
  }

  get auxDropdownButton() {
    return this.parentElement.find(this.auxDropdownButtonSelector);
  }

  get auxDropdownItem() {
    return this.parentElement.find(this.auxDropdownItemSelector);
  }

  get addClientScopeButton() {
    return this.primaryButton;
  }

  get changeTypeToButton() {
    return this.parentElement.find(this.changeTypeDropdownButtonSelector);
  }

  get changeTypeToMenuItemButton() {
    return this.parentElement.find(this.auxDropdownItemSelector);
  }

  get dropdownActionButton() {
    return this.parentElement.find(this.dropdownActionButtonSelector);
  }

  get dropdownActionMenuItemButton() {
    return this.parentElement.find(this.dropdownActionMenuItemButtonSelector);
  }

  selectFilter(filter: Filter) {
    this.filterDropdownButton.click();
    this.filterDropdownItem.contains(filter).click();

    return this;
  }

  selectAssignedType(filterAssignedType: FilterAssignedType) {
    this.selectFilter(Filter.AssignedType);
    this.auxDropdownButton.click();
    this.auxDropdownItem.contains(filterAssignedType).click();

    return this;
  }

  selectProtocol(filterProtocol: FilterProtocol) {
    this.selectFilter(Filter.Protocol);
    this.auxDropdownButton.click();
    this.auxDropdownItem.contains(filterProtocol).click();

    return this;
  }

  performActionDelete() {
    this.dropdownActionButton.click();
    this.dropdownActionMenuItemButton.contains("Delete").click();

    return this;
  }

  performActionRemove() {
    this.dropdownActionButton.click();
    this.dropdownActionMenuItemButton.contains("Remove").click();
    this.dropdownActionMenuItemButton.contains("Remove").should("not.exist");
    return this;
  }

  changeTypeTo(assignedType: FilterAssignedType) {
    this.changeTypeToButton.click();
    this.changeTypeToMenuItemButton.contains(assignedType).click();
    this.changeTypeToMenuItemButton.should("not.exist");
    return this;
  }

  changeTypeToNone() {
    return this.changeTypeTo(FilterAssignedType.None);
  }

  changeTypeToDefault() {
    return this.changeTypeTo(FilterAssignedType.Default);
  }

  changeTypeToOptional() {
    return this.changeTypeTo(FilterAssignedType.Optional);
  }
}
