import { BasePage } from "../../BasePage";
import RealmRolesToolbarComponent from "./components/RealmRolesToolbarComponent";

export default class RealmRolesPage extends BasePage {
  cmpToolbar = new RealmRolesToolbarComponent();

  constructor() {
    super(RegExp("/roles"));
  }

  goToPage() {
    this.cmpSidebarMenu.goToRealmRoles();

    return this;
  }
}
