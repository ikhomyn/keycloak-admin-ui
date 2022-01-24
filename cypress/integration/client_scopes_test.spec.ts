import LoginPage from "../support/pages/LoginPage";
import Masthead from "../support/pages/admin_console/Masthead";
import ListingPage from "../support/pages/admin_console/ListingPage";
import SidebarPage from "../support/pages/admin_console/SidebarPage";
import CreateClientScopePage from "../support/pages/admin_console/manage/client_scopes/CreateClientScopePage";
import { keycloakBefore } from "../support/util/keycloak_hooks";
import RoleMappingTab from "../support/pages/admin_console/manage/RoleMappingTab";
import ModalUtils from "../support/util/ModalUtils";
import AdminClient from "../support/util/AdminClient";

import ClientScopesPage from "../support/pages/admin_console/manage/client_scopes/ClientScopesPage";
import {
  FilterAssignedType,
  FilterProtocol,
} from "../support/pages/admin_console/manage/client_scopes/components/ClientScopesToolbarComponent";

let itemId = "client_scope_crud";
const loginPage = new LoginPage();
const masthead = new Masthead();
const sidebarPage = new SidebarPage();
const listingPage = new ListingPage();
const createClientScopePage = new CreateClientScopePage();
const modalUtils = new ModalUtils();
const clientScopesPage = new ClientScopesPage();

describe("Client Scopes test", () => {
  const modalMessageDeleteConfirmation =
    "Are you sure you want to delete this client scope";
  const notificationMessageDeletionConfirmation =
    "The client scope has been deleted";
  const clientScopeName = "client-scope-test";
  const openIDConnectItemText = "OpenID Connect";
  const clientScope = {
    name: clientScopeName,
    description: "",
    protocol: "openid-connect",
    attributes: {
      "include.in.token.scope": "true",
      "display.on.consent.screen": "true",
      "gui.order": "1",
      "consent.screen.text": "",
    },
  };

  before(async () => {
    const client = new AdminClient();
    for (let i = 0; i < 5; i++) {
      clientScope.name = clientScopeName + i;
      await client.createClientScope(clientScope);
    }
  });

  beforeEach(() => {
    keycloakBefore();
    loginPage.logIn();
    clientScopesPage.goToPage();
  });

  after(async () => {
    const client = new AdminClient();
    for (let i = 0; i < 5; i++) {
      await client.deleteClientScope(clientScopeName + i);
    }
  });

  describe("Client Scope filter list items", () => {
    it("should filter item by name", () => {
      const itemName = clientScopeName + 0;
      clientScopesPage.searchItemByName(itemName);
      listingPage.itemsEqualTo(1).itemExist(itemName, true);
    });

    it("should filter items by Assigned type All types", () => {
      clientScopesPage.filterItemsByAssignedTypeAllTypes();
      listingPage
        .itemExist(FilterAssignedType.Default, true)
        .itemExist(FilterAssignedType.Optional, true)
        .itemExist(FilterAssignedType.None, true);
    });

    it("should filter items by Assigned type Default", () => {
      clientScopesPage.filterItemsByAssignedTypeDefault();
      listingPage
        .itemExist(FilterAssignedType.Default, true)
        .itemExist(FilterAssignedType.Optional, false)
        .itemExist(FilterAssignedType.None, false);
    });

    it("should filter items by Assigned type Optional", () => {
      clientScopesPage.filterItemsByAssignedTypeOptional();
      listingPage
        .itemExist(FilterAssignedType.Default, false)
        .itemExist(FilterAssignedType.Optional, true)
        .itemExist(FilterAssignedType.None, false);
    });

    it("should filter items by Protocol All", () => {
      clientScopesPage.filterItemsByProtocolAll();
      listingPage
        .showNextPageTableItems()
        .itemExist(openIDConnectItemText, true)
        .itemExist(FilterProtocol.SAML, true);
    });

    it("should filter items by Protocol SAML", () => {
      clientScopesPage.filterItemsByProtocolSAML();
      listingPage
        .itemExist(FilterProtocol.SAML, true)
        .itemExist(openIDConnectItemText, false);
    });

    it("should filter items by Protocol OpenID", () => {
      clientScopesPage.filterItemsByProtocolOpenID();
      listingPage
        .itemExist(FilterProtocol.SAML, false)
        .itemExist(openIDConnectItemText, true); //FilterProtocol.OpenID //TODO: will fail, text does not match.
    });

    it("should show items on next page are more than 11", () => {
      listingPage.showNextPageTableItems();
      listingPage.itemsGreaterThan(1);
    });
  });

  describe("Client Scope modify list items", () => {
    const itemName = clientScopeName + 0;

    it("should modify selected item type to Default from search bar", () => {
      listingPage.clickItemCheckbox(itemName);
      clientScopesPage.componentToolbar.changeTypeToDefault();
      listingPage.itemContainValue(itemName, 2, FilterAssignedType.Default);
    });

    it("should modify selected item type to Optional from search bar", () => {
      listingPage.clickItemCheckbox(itemName);
      clientScopesPage.componentToolbar.changeTypeToOptional();
      listingPage.itemContainValue(itemName, 2, FilterAssignedType.Optional);
    });

    const expectedItemAssignedTypes = [
      FilterAssignedType.Default,
      FilterAssignedType.Optional,
      FilterAssignedType.None,
    ];
    expectedItemAssignedTypes.forEach(($assignedType) => {
      const itemName = clientScopeName + 0;
      it(`should modify item ${itemName} AssignedType to ${$assignedType} from item bar`, () => {
        listingPage
          .searchItem(clientScopeName, false)
          .clickRowSelectItem(itemName, $assignedType);
        listingPage.searchItem(itemName, false).itemExist($assignedType);
      });
    });

    it("should not allow to modify non-selected item type from search bar", () => {
      const itemName = clientScopeName + 0;
      listingPage.searchItem(itemName, false);
      clientScopesPage.componentToolbar.changeTypeToButton.should(
        "be.disabled"
      );
      clientScopesPage.componentToolbar.dropdownActionButton.click();
      clientScopesPage.componentToolbar.dropdownActionMenuItemButton.should(
        "have.attr",
        "aria-disabled",
        "true"
      );
      listingPage.clickItemCheckbox(itemName);
      clientScopesPage.componentToolbar.changeTypeToButton.should("be.enabled");
      clientScopesPage.componentToolbar.dropdownActionButton.click();
      clientScopesPage.componentToolbar.dropdownActionMenuItemButton.should(
        "have.attr",
        "aria-disabled",
        "false"
      );
      listingPage.clickItemCheckbox(itemName);
      clientScopesPage.componentToolbar.changeTypeToButton.should(
        "be.disabled"
      );
      clientScopesPage.componentToolbar.dropdownActionButton.click();
      clientScopesPage.componentToolbar.dropdownActionMenuItemButton.should(
        "have.attr",
        "aria-disabled",
        "true"
      );
    });

    /*it("should export item from item bar", () => { //TODO: blocked by https://github.com/keycloak/keycloak-admin-ui/issues/1952

    });*/
  });

  describe("Client Scope delete list items ", () => {
    it("should delete item from item bar", () => {
      clientScopesPage.componentToolbar.changeTypeToButton.should(
        "be.disabled"
      );
      listingPage.clickItemCheckbox(clientScopeName + 0);
      listingPage.deleteItem(clientScopeName + 0);
      modalUtils
        .checkModalMessage(modalMessageDeleteConfirmation)
        .confirmModal();
      masthead.checkNotificationMessage(
        notificationMessageDeletionConfirmation
      );
      //clientScopesPage.componentToolbar.changeTypeToButton.should('be.disabled'); //TODO: will fail
    });

    it("should delete selected item from search bar", () => {
      clientScopesPage.componentToolbar.changeTypeToButton.should(
        "be.disabled"
      );
      listingPage.clickItemCheckbox(clientScopeName + 1);
      clientScopesPage.componentToolbar.performActionDelete();

      modalUtils
        .checkModalMessage(modalMessageDeleteConfirmation)
        .confirmModal();
      masthead.checkNotificationMessage(
        notificationMessageDeletionConfirmation
      );
      //clientScopesPage.componentToolbar.changeTypeToButton.should('be.disabled'); //TODO: will fail
    });

    it("should delete multiple selected items from search bar", () => {
      clientScopesPage.componentToolbar.changeTypeToButton.should(
        "be.disabled"
      );
      listingPage.clickItemCheckbox(clientScopeName + 2);
      listingPage.clickItemCheckbox(clientScopeName + 3);
      listingPage.clickItemCheckbox(clientScopeName + 4);
      clientScopesPage.componentToolbar.performActionDelete();

      modalUtils
        .checkModalMessage(modalMessageDeleteConfirmation)
        .confirmModal();
      masthead.checkNotificationMessage(
        notificationMessageDeletionConfirmation
      );
      //clientScopesPage.componentToolbar.changeTypeToButton.should('be.disabled'); //TODO: will fail due to wrong functionality
    });
  });

  describe("Client Scope creation", () => {
    beforeEach(() => {
      keycloakBefore();
      loginPage.logIn();
      sidebarPage.goToClientScopes();
    });

    it("should fail creating client scope", () => {
      listingPage.goToCreateItem();

      createClientScopePage.save().checkClientNameRequiredMessage();

      createClientScopePage
        .fillClientScopeData("address")
        .save()
        .checkClientNameRequiredMessage(false);

      // The error should inform about duplicated name/id
      masthead.checkNotificationMessage(
        "Could not create client scope: 'Client Scope address already exists'"
      );
    });

    it("Client scope CRUD test", () => {
      itemId += "_" + (Math.random() + 1).toString(36).substring(7);

      // Create
      listingPage.itemExist(itemId, false).goToCreateItem();

      createClientScopePage.fillClientScopeData(itemId).save();

      masthead.checkNotificationMessage("Client scope created");

      sidebarPage.goToClientScopes();
      sidebarPage.waitForPageLoad();

      // Delete
      listingPage
        .searchItem(itemId, false)
        .itemExist(itemId)
        .deleteItem(itemId);

      modalUtils
        .checkModalMessage(modalMessageDeleteConfirmation)
        .confirmModal();

      masthead.checkNotificationMessage("The client scope has been deleted");

      listingPage.itemExist(itemId, false);
    });
  });

  describe("Scope test", () => {
    const scopeTab = new RoleMappingTab();
    const scopeName = "address";

    beforeEach(() => {
      keycloakBefore();
      loginPage.logIn();
      sidebarPage.goToClientScopes();
    });

    it("Assign role", () => {
      const role = "offline_access";
      listingPage.searchItem(scopeName, false).goToItemDetails(scopeName);
      scopeTab.goToScopeTab().assignRole().selectRow(role).assign();
      masthead.checkNotificationMessage("Role mapping updated");
      scopeTab.checkRoles([role]);
      scopeTab.hideInheritedRoles().selectRow(role).unAssign();
      modalUtils.checkModalTitle("Remove mapping?").confirmModal();
      scopeTab.checkRoles([]);
    });
  });
});
