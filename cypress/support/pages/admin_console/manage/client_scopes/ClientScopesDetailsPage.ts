import { BasePage } from "../../BasePage";
import ClientScopesTabComponent from "./components/ClientScopesTabComponent";

export default class ClientScopesDetailsPage extends BasePage {
  componentTab = new ClientScopesTabComponent();

  constructor() {
    super(RegExp("/client-scopes/.*/default/settings"));
  }

  goToPage(): this {
    throw new Error("Direct navigation to this page is not supported");
  }
}
