import ClientsTabComponent from "./components/ClientsTabComponent";
import { BasePage } from "../../BasePage";

export default class ClientsPage extends BasePage {
  //cmpList : Object
  //cmpToolbar :
  public cmpTabs: ClientsTabComponent = new ClientsTabComponent();

  constructor() {
    super(RegExp("/clients/"));
  }

  goToPage() {
    this.cmpSidebarMenu.goToClients();

    return this;
  }
}
