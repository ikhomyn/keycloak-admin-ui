import GroupModal from "../support/pages/admin_console/manage/groups/GroupModal";
import GroupDetailPage from "../support/pages/admin_console/manage/groups/group_details/GroupDetailPage";
import AttributesTab from "../support/pages/admin_console/manage//AttributesTab";
import { SearchGroupPage } from "../support/pages/admin_console/manage/groups/SearchGroupPage";
import SidebarPage from "../support/pages/admin_console/SidebarPage";
import LoginPage from "../support/pages/LoginPage";
import { keycloakBefore } from "../support/util/keycloak_hooks";
import GroupPage from "../support/pages/admin_console/manage/groups/GroupPage";
import ChildGroupsTab from "../support/pages/admin_console/manage/groups/group_details/tabs/ChildGroupsTab";
import MembersTab from "../support/pages/admin_console/manage/groups/group_details/tabs/MembersTab";
import adminClient from "../support/util/AdminClient";

describe("Group test", () => {
  const loginPage = new LoginPage();
  const sidebarPage = new SidebarPage();
  const groupModal = new GroupModal();
  const searchGroupPage = new SearchGroupPage();
  const attributesTab = new AttributesTab();
  const groupPage = new GroupPage();
  const groupDetailPage = new GroupDetailPage();
  const childGroupsTab = new ChildGroupsTab();
  const membersTab = new MembersTab();

  const groupNamePrefix = "group_";
  let groupName: string;
  const groupNames: string[] = [];
  const predefinedGroups = ["level", "level1", "level2", "level3"];
  const emptyGroup = "empty-group";
  const users: { id: string; username: string }[] = [];

  before(async () => {
    for (let i = 0; i < 5; i++) {
      const username = "user" + i;
      const user = await adminClient.createUser({
        username: username,
        enabled: true,
      });
      users.push({ id: user.id, username: username });
    }
    console.log("DEBUG USERS");
    console.log(users);
  });

  beforeEach(() => {
    keycloakBefore();
    loginPage.logIn();
    sidebarPage.goToGroups();
    groupName = groupNamePrefix + (Math.random() + 1).toString(36).substring(7);
    groupNames.push(groupName);
  });

  describe("List", () => {
    it("Create group from empty option", () => {
      groupPage
        .assertNoGroupsInThisRealmEmptyStateMessageExist(true)
        .createGroup(groupName, true)
        .assertNotificationGroupCreated()
        .searchGroup(groupName)
        .assertGroupItemExist(groupName, true);
    });

    it("Create group from search bar", () => {
      groupPage
        .assertNoGroupsInThisRealmEmptyStateMessageExist(false)
        .createGroup(groupName, false)
        .assertNotificationGroupCreated()
        .searchGroup(groupName)
        .assertGroupItemExist(groupName, true);
    });

    it("Fail to create group with empty name", () => {
      groupPage
        .assertNoGroupsInThisRealmEmptyStateMessageExist(false)
        .createGroup(" ", false)
        .assertNotificationCouldNotCreateGroupWithEmptyName();
      groupModal.closeModal();
      groupPage.searchGroup(" ").assertNoSearchResultsMessageExist(true);
    });

    it("Fail to create group with duplicated name", () => {
      groupPage
        .assertNoGroupsInThisRealmEmptyStateMessageExist(false)
        .createGroup(groupName, false)
        .createGroup(groupName, false)
        .assertNotificationCouldNotCreateGroupWithDuplicatedName(groupName);
      groupModal.closeModal();
      groupPage.searchGroup(groupName).assertGroupItemsEqual(1);
    });

    it("Empty search", () => {
      groupPage.searchGroup("   ").assertNoSearchResultsMessageExist(true);
    });

    it("Search group that exists", () => {
      groupPage
        .searchGroup(groupNames[0])
        .assertGroupItemExist(groupNames[0], true);
    });

    it("Search group that does not exists", () => {
      groupPage
        .searchGroup("not-existent-group")
        .assertNoSearchResultsMessageExist(true);
    });

    it("Delete group from item bar", () => {
      groupPage
        .searchGroup(groupNames[0])
        .deleteGroupItem(groupNames[0])
        .assertNotificationGroupDeleted()
        .searchGroup(groupNames[0])
        .assertNoSearchResultsMessageExist(true);
    });

    it("Delete group from search bar", () => {
      groupPage
        .selectGroupItemCheckbox([groupNames[1]])
        .deleteSelectedGroups()
        .assertNotificationGroupDeleted()
        .searchGroup(groupNames[1])
        .assertNoSearchResultsMessageExist(true);
    });

    it("Delete groups from search bar", () => {
      cy.wrap(null).then(() =>
        adminClient.createGroup("group_multiple_deletion_test")
      );
      cy.reload();
      groupPage
        .selectGroupItemCheckboxAllRows()
        .deleteSelectedGroups()
        .assertNotificationGroupsDeleted()
        .assertNoGroupsInThisRealmEmptyStateMessageExist(true);
    });
  });

  describe("Search group under current group", () => {
    before(async () => {
      const createdGroups = await adminClient.createSubGroups(predefinedGroups);
      for (let i = 0; i < 5; i++) {
        adminClient.addUserToGroup(users[i].id!, createdGroups[i % 3].id);
      }
      adminClient.createUser({ username: "new", enabled: true });
    });

    it("Search child group in group", () => {
      groupPage
        .goToGroupChildGroupsTab(predefinedGroups[0])
        .searchGroup(predefinedGroups[1])
        .goToGroupChildGroupsTab(predefinedGroups[1])
        .searchGroup(predefinedGroups[2])
        .assertGroupItemExist(predefinedGroups[2], true);
    });

    it("Search non existing child group in group", () => {
      groupPage
        .goToGroupChildGroupsTab(predefinedGroups[0])
        .searchGroup("non-existent-sub-group")
        .assertNoSearchResultsMessageExist(true);
    });

    it("Empty search in group", () => {
      groupPage
        .goToGroupChildGroupsTab(predefinedGroups[0])
        .searchGroup("   ")
        .assertNoSearchResultsMessageExist(true);
    });
  });

  describe("Group Actions", () => {
    const groupNameDeleteHeaderAction = "group_test_delete_header_action";

    before(async () => {
      await adminClient.createGroup(groupNameDeleteHeaderAction);
    });

    after(async () => {
      await adminClient.deleteGroups();
    });

    describe("Search globally", () => {
      it("Check empty state", () => {
        groupPage
          .headerActionsearchGroup()
          .assertNoSearchResultsMessageExist(true);
      });

      it("Search with multiple words", () => {
        groupPage.headerActionsearchGroup();
        searchGroupPage
          .searchGroup(
            predefinedGroups[0].substr(0, predefinedGroups[0].length / 2)
          )
          .assertGroupItemExist(predefinedGroups[0], true)
          .searchGroup(
            predefinedGroups[0].substr(
              predefinedGroups[0].length / 2,
              predefinedGroups[0].length
            )
          )
          .assertGroupItemExist(predefinedGroups[0], true);
      });

      it("Navigate to parent group details", () => {
        groupPage.headerActionsearchGroup();
        searchGroupPage
          .searchGroup(predefinedGroups[0])
          .goToGroupChildGroupsTab(predefinedGroups[0])
          .assertGroupItemExist(predefinedGroups[1], true);
      });

      it("Navigate to sub-group details", () => {
        groupPage.headerActionsearchGroup();
        searchGroupPage
          .searchGroup(predefinedGroups[1])
          .goToGroupChildGroupsTab(predefinedGroups[1])
          .assertGroupItemExist(predefinedGroups[2], true);
      });
    });

    it("Rename group", () => {
      groupPage.goToGroupChildGroupsTab(predefinedGroups[0]);
      groupDetailPage
        .renameGroup("new_group_name")
        .assertNotificationGroupUpdated()
        .assertHeaderGroupNameEqual("new_group_name")
        .renameGroup(predefinedGroups[0])
        .assertNotificationGroupUpdated()
        .assertHeaderGroupNameEqual(predefinedGroups[0]);
    });

    it("Delete group from group details", () => {
      groupPage.goToGroupChildGroupsTab(groupNameDeleteHeaderAction);
      groupDetailPage
        .headerActionDeleteGroup()
        .assertNotificationGroupDeleted()
        .assertGroupItemExist(groupNameDeleteHeaderAction, false);
    });
  });

  describe("Child Groups", () => {
    before(async () => {
      await adminClient.createGroup(predefinedGroups[0]);
    });

    after(async () => {
      await adminClient.deleteGroups();
    });

    beforeEach(() => {
      groupPage.goToGroupChildGroupsTab(predefinedGroups[0]);
    });

    it("Check empty state", () => {
      childGroupsTab.assertNoGroupsInThisSubGroupEmptyStateMessageExist(true);
    });

    it("Create group from empty state", () => {
      childGroupsTab
        .createGroup(predefinedGroups[1], true)
        .assertNotificationGroupCreated();
    });

    it("Create group from search bar", () => {
      childGroupsTab
        .createGroup(predefinedGroups[2], false)
        .assertNotificationGroupCreated();
    });

    it("Fail to create group with empty name", () => {
      childGroupsTab
        .createGroup(" ", false)
        .assertNotificationCouldNotCreateGroupWithEmptyName();
    });

    // https://github.com/keycloak/keycloak-admin-ui/issues/2726
    it.skip("Fail to create group with duplicated name", () => {
      childGroupsTab
        .createGroup(predefinedGroups[2], false)
        .assertNotificationCouldNotCreateGroupWithDuplicatedName(
          predefinedGroups[2]
        );
    });

    it("Move group from item bar", () => {
      childGroupsTab
        .moveGroupItemAction(predefinedGroups[1], [
          predefinedGroups[0],
          predefinedGroups[2],
        ])
        .goToGroupChildGroupsTab(predefinedGroups[2])
        .assertGroupItemExist(predefinedGroups[1], true);
    });

    it("Search group", () => {
      childGroupsTab
        .searchGroup(predefinedGroups[2])
        .assertGroupItemExist(predefinedGroups[2], true);
    });

    it("Show child group in groups", () => {
      childGroupsTab
        .goToGroupChildGroupsTab(predefinedGroups[2])
        .goToGroupChildGroupsTab(predefinedGroups[1])
        .assertNoGroupsInThisSubGroupEmptyStateMessageExist(true);
    });

    it("Delete group from search bar", () => {
      childGroupsTab
        .goToGroupChildGroupsTab(predefinedGroups[2])
        .selectGroupItemCheckbox([predefinedGroups[1]])
        .deleteSelectedGroups()
        .assertNotificationGroupDeleted();
    });

    it("Delete group from item bar", () => {
      childGroupsTab
        .deleteGroupItem(predefinedGroups[2])
        .assertNotificationGroupDeleted()
        .assertNoGroupsInThisSubGroupEmptyStateMessageExist(true);
    });
  });

  describe("Members", () => {
    before(async () => {
      const createdGroups = await adminClient.createSubGroups(predefinedGroups);
      for (let i = 0; i < 5; i++) {
        adminClient.addUserToGroup(users[i].id!, createdGroups[i % 3].id);
      }
      await adminClient.createGroup(emptyGroup);
    });

    beforeEach(() => {
      groupPage.goToGroupChildGroupsTab(predefinedGroups[0]);
      childGroupsTab.goToMembersTab();
    });

    it("Add member from search bar", () => {
      membersTab
        .addMember(["new"], false)
        .assertNotificationUserAddedToTheGroup(1);
    });

    it("Show members with sub-group users", () => {
      membersTab
        .assertUserItemExist(users[0].username, true)
        .assertUserItemExist("new", true)
        .assertUserItemExist(users[3].username, true)
        .clickCheckboxIncludeSubGroupUsers()
        .assertUserItemExist("new", true)
        .assertUserItemExist(users[0].username, true)
        .assertUserItemExist(users[1].username, true)
        .assertUserItemExist(users[2].username, true)
        .assertUserItemExist(users[3].username, true)
        .assertUserItemExist(users[4].username, true)
        .goToChildGroupsTab()
        .goToGroupChildGroupsTab(predefinedGroups[1])
        .goToMembersTab()
        .assertUserItemExist(users[1].username, true)
        .assertUserItemExist(users[4].username, true)
        .goToChildGroupsTab()
        .goToGroupChildGroupsTab(predefinedGroups[2])
        .goToMembersTab()
        .assertUserItemExist(users[2].username, true);
    });

    it("Add member from empty state", () => {
      sidebarPage.goToGroups();
      groupPage.goToGroupChildGroupsTab(emptyGroup);
      childGroupsTab.goToMembersTab();
      membersTab
        .addMember([users[0].username, users[1].username], true)
        .assertNotificationUserAddedToTheGroup(2);
    });

    it("Leave group from search bar", () => {
      sidebarPage.goToGroups();
      groupPage.goToGroupChildGroupsTab(emptyGroup);
      childGroupsTab.goToMembersTab();
      membersTab
        .selectUserItemCheckbox([users[0].username])
        .leaveGroupSelectedUsers()
        .assertNotificationUserLeftTheGroup(1)
        .assertUserItemExist(users[0].username, false);
    });

    it("Leave group from item bar", () => {
      sidebarPage.goToGroups();
      groupPage.goToGroupChildGroupsTab(emptyGroup);
      childGroupsTab.goToMembersTab();
      membersTab
        .leaveGroupUserItem(users[1].username)
        .assertNotificationUserLeftTheGroup(1)
        .assertNoUsersFoundEmptyStateMessageExist(true);
    });
  });

  describe("Breadcrumbs", () => {
    it("Navigate to parent group", () => {
      groupPage
        .goToGroupChildGroupsTab(predefinedGroups[0])
        .goToGroupChildGroupsTab(predefinedGroups[1])
        .goToGroupChildGroupsTab(predefinedGroups[2])
        .goToGroupChildGroupsTab(predefinedGroups[3]);
      cy.reload();
      groupPage.clickBreadcrumbItem(predefinedGroups[2]);
      groupDetailPage.assertHeaderGroupNameEqual(predefinedGroups[2]);
      groupPage.clickBreadcrumbItem(predefinedGroups[1]);
      groupDetailPage.assertHeaderGroupNameEqual(predefinedGroups[1]);
      groupPage.clickBreadcrumbItem(predefinedGroups[0]);
      groupDetailPage.assertHeaderGroupNameEqual(predefinedGroups[0]);
      groupPage
        .clickBreadcrumbItem("Groups")
        .assertGroupItemExist(predefinedGroups[0], true);
    });
  });

  describe("Attributes", () => {
    beforeEach(() => {
      groupPage.goToGroupChildGroupsTab(predefinedGroups[0]);
      groupDetailPage.goToAttributesTab();
    });

    it("Add attribute", () => {
      attributesTab.addAttribute("key", "value").save();
      groupPage.assertNotificationGroupUpdated();
    });

    it("Remove attribute", () => {
      attributesTab.deleteAttribute(1).asseertRowItemsEqualTo(1);
      groupPage.assertNotificationGroupUpdated();
    });

    it("Revert changes", () => {
      attributesTab
        .addAttribute("key", "value")
        .addAnAttributeButton()
        .revert()
        .asseertRowItemsEqualTo(1);
    });
  });

  describe("'Move to' function", () => {
    it("Move group to other group", () => {
      groupPage
        .moveGroupItemAction(predefinedGroups[0], [emptyGroup])
        .goToGroupChildGroupsTab(emptyGroup)
        .assertGroupItemExist(predefinedGroups[0], true);
    });

    it("Move group to root", () => {
      groupPage
        .goToGroupChildGroupsTab(emptyGroup)
        .moveGroupItemAction(predefinedGroups[0], ["root"]);
      sidebarPage.goToGroups();
      groupPage.assertGroupItemExist(predefinedGroups[0], true);
    });
  });
});
