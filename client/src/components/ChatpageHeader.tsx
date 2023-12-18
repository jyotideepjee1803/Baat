import { NotificationsNone, GroupAdd, PersonSearch } from "@mui/icons-material";
import { Avatar, IconButton } from "@mui/material";
import { SetStateAction, useEffect, useState } from "react";
import AddMembersToGroup from "./dialogs/AddMembersToGroup";
import NotificationsMenu from "./menus/NotificationsMenu";
import ProfileSettingsMenu from "./menus/ProfileSettingsMenu";
import SearchUsersDrawer from "./utils/SearchUsersDrawer";
import getCustomTooltip from "./utils/CustomTooltip";

import { 
  displayDialog, 
  setShowDialogActions 
} from "../store/slices/CustomDialogSlice";
import { useSelector } from "react-redux";
import { selectAppState, setGroupInfo} from "../store/slices/AppSlice";
import { useAppDispatch } from "../store/storeHooks";

import {
  ChatType,
  ClickEventHandler,
  DialogBodySetter,
} from "../utils/AppTypes";
import { ThemeSwitch } from "./utils/ThemeSwitch";

const DEFAULT_GROUP_DP = process.env.REACT_APP_DEFAULT_GROUP_DP;

interface Props {
  chats: ChatType[];
  setDialogBody: DialogBodySetter;
}

const arrowStyles = { color: "#666" };
const tooltipStyles = {
  maxWidth: 250,
  color: "#eee",
  fontFamily: "Trebuchet MS",
  fontSize: 16,
  padding: "5px 15px",
  backgroundColor: "#666",
};
const CustomTooltip = getCustomTooltip(arrowStyles, tooltipStyles);

const ChatpageHeader = ({ chats, setDialogBody }: Props) => {

  const dispatch = useAppDispatch();

  const { loggedInUser } = useSelector(selectAppState);
  const notifCount = loggedInUser?.notifications?.length || "";

  const [animateNotif, setAnimateNotif] = useState(false);
  const [notificationsMenuAnchor, setNotificationsMenuAnchor] =
    useState<HTMLElement | null>(null);
  const [profileSettingsMenuAnchor, setProfileSettingsMenuAnchor] =
    useState<HTMLElement | null>(null);

  const openNotificationMenu: ClickEventHandler = (e) =>
    setNotificationsMenuAnchor(e.target as SetStateAction<HTMLElement | null>);

  const openProfileSettingsMenu: ClickEventHandler = (e) =>
    setProfileSettingsMenuAnchor(
      e.target as SetStateAction<HTMLElement | null>
  );

  // For opening/closing 'search users' left drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openCreateGroupChatDialog = () => {
    dispatch(
      setGroupInfo({
        chatDisplayPic: null,
        chatDisplayPicUrl: DEFAULT_GROUP_DP,
        chatName: "",
        users: [],
      })
    );
    dispatch(setShowDialogActions(true));
    setDialogBody(<AddMembersToGroup forCreateGroup={true} />);
    dispatch(
      displayDialog({
        title: "Add Group Members",
        nolabel: "Cancel",
        yeslabel: "Next",
        action: null,
      })
    );
  };

  useEffect(() => {
    if (animateNotif) return;
    setAnimateNotif(true);
    let timeout = setTimeout(() => {
      setAnimateNotif(false);
    }, 1000);
    return () => clearTimeout(timeout);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifCount]);

  return (
    <div
      className={`chatpageHeader chatpageView col-1 d-flex flex-column justify-content-between align-items-center user-select-none`}
    >
      <div className={`align-items-center`}>
      {/*Profile */}
      <div style={{marginTop :"10px"}}>
        <CustomTooltip title="Profile Settings" placement="bottom-end" arrow>
          <IconButton
            className="mx-md-3 mx-lg-4"
            sx={{
              color: "#cadeef",
              ":hover": { backgroundColor: "#cadeef" },
            }}
            onClick={openProfileSettingsMenu}
          >
            <Avatar
              alt="LoggedInUser"
              className="img-fluid"
              src={loggedInUser?.profilePic}
            />
          </IconButton>
        </CustomTooltip>
      </div>
      <ProfileSettingsMenu
          anchor={profileSettingsMenuAnchor as HTMLElement}
          setAnchor={setProfileSettingsMenuAnchor}
          setDialogBody={setDialogBody}
      />
      {/* User notification*/}
      <div className={`mb-1`}>
        <CustomTooltip title={`Notifications`} placement="top-end" arrow>
          <IconButton
            className="position-relative mx-1"
            onClick={openNotificationMenu}
            sx={{
              ":hover": { backgroundColor: "#cadeef"},
            }}
          >
            {notifCount && (
              <span
                className={`notifBadge ${
                  animateNotif ? "notifCountChange" : ""
                } badge rounded-circle bg-danger 
               position-absolute`}
                style={{
                  fontSize: notifCount > 99 ? 12 : 13,
                  top: -2,
                  right: notifCount > 99 ? -11 : notifCount > 9 ? -5 : -2,
                  padding:
                    notifCount > 99
                      ? "6px 5px"
                      : notifCount > 9
                      ? "4px 5px"
                      : "4px 7px",
                }}
              >
                {!notifCount ? "" : notifCount > 99 ? "99+" : notifCount}
              </span>
            )}
            <NotificationsNone style={{color: "#0784b5"}} />
          </IconButton>
        </CustomTooltip>
      </div>
      <NotificationsMenu
          chats={chats}
          anchor={notificationsMenuAnchor as HTMLElement}
          setAnchor={setNotificationsMenuAnchor}
      />

      {/* Search Users to create/access chat */}
      <CustomTooltip title="Search users" placement="bottom-end" arrow>
        <IconButton
          sx={{
            color: "#cadeef",
            ":hover": { backgroundColor: "#cadeef" },
          }}
          className={`position-relative mx-1`}
          onClick={() => setIsDrawerOpen(true)}
        >
          <PersonSearch style={{color: "#0784b5"}}/>
        </IconButton>
      </CustomTooltip>
      <SearchUsersDrawer
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
      />

      <CustomTooltip
          title="Create New Group Chat"
          placement="bottom-end"
          arrow
        >
          <IconButton
            className="mx-md-3 mx-lg-4"
            sx={{
              color: "#cadeef",
              ":hover": { backgroundColor: "#cadeef" },
            }}
            onClick={openCreateGroupChatDialog}
          >
            <GroupAdd style={{color: "#0784b5"}}/>
          </IconButton>
        </CustomTooltip>
      </div>

      {/* Theme settings  */}
      {/* <div style={{padding : 10}}>
        <CustomTooltip 
          title="Change Theme"
          placement="bottom-end"
          arrow
        >
          <ThemeSwitch defaultChecked/>
        </CustomTooltip>
      </div> */}
    </div>
  );
};

export default ChatpageHeader;
