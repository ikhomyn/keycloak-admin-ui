import SidebarPage from "../../../admin_console/SidebarPage";
import ClientScopesToolbarComponent, {
  Filter,
  FilterAssignedType,
  FilterProtocol,
} from "./components/ClientScopesToolbarComponent";
import ClientScopesDetailsPage from "./ClientScopesDetailsPage";
import { BasePage } from "../../BasePage";
import ListingPage from "../../ListingPage";

const sidebarPage = new SidebarPage();
const clientScopesDetailsPage = new ClientScopesDetailsPage();
const listingPage = new ListingPage();

export default class ClientScopesPage extends BasePage {
  componentToolbar = new ClientScopesToolbarComponent();

  constructor() {
    super(RegExp(".*/client-scopes"));
  }

  goToPage(): this {
    sidebarPage.goToClientScopes();
    return this;
  }

  goToClientScopesDetailsPage(clienScopeItemName: string) {
    this.componentToolbar.searchFor(clienScopeItemName);
    listingPage.goToItemDetails(clienScopeItemName);
    return clientScopesDetailsPage;
  }

  searchItemByName(value: string) {
    this.componentToolbar.selectFilter(Filter.Name);
    this.componentToolbar.searchFor(value);

    return this;
  }

  filterItemsByAssignedTypeAllTypes() {
    this.componentToolbar.selectAssignedType(FilterAssignedType.AllTypes);

    return this;
  }

  filterItemsByAssignedTypeDefault() {
    this.componentToolbar.selectAssignedType(FilterAssignedType.Default);

    return this;
  }

  filterItemsByAssignedTypeOptional() {
    this.componentToolbar.selectAssignedType(FilterAssignedType.Optional);

    return this;
  }

  filterItemsByProtocolAll() {
    this.componentToolbar.selectProtocol(FilterProtocol.All);

    return this;
  }

  filterItemsByProtocolSAML() {
    this.componentToolbar.selectProtocol(FilterProtocol.SAML);

    return this;
  }

  filterItemsByProtocolOpenID() {
    this.componentToolbar.selectProtocol(FilterProtocol.OpenID);

    return this;
  }
}
