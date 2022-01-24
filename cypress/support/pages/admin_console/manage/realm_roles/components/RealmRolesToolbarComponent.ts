import BaseToolbarComponent from "../../../components/BaseToolbarComponent";
import CreateRealmRolePage from "../CreateRealmRolePage";
import RealmRolesPage from "../RealmRolesPage";

export default class RealmRolesToolbarComponent extends BaseToolbarComponent {
  get searchRoleInput() {
    return this.searchInput;
  }

  get createRoleButton() {
    return this.primaryButton;
  }

  searchRoleByName(roleName: string) {
    this.searchRoleInput.type(roleName);
    this.searchButton.click();

    return new RealmRolesPage();
  }

  createRole(roleName: string, roleDesciption: string = "") {
    this.createRoleButton.click();
    const createRealmRolePage = new CreateRealmRolePage();
    return createRealmRolePage.fillRealmRoleData(roleName, roleDesciption);
  }
}
