import { ArrowBack, Close, VideoCallOutlined } from "@mui/icons-material";
import { Avatar, IconButton } from "@mui/material";
import { selectAppState, setSelectedCall } from "../store/slices/AppSlice";
import { useAppDispatch, useAppSelector } from "../store/storeHooks";
import { ClickEventHandler, CustomTooltipType } from "../utils/AppTypes";
import { getOneToOneChatReceiver, truncateString } from "../utils/appUtils";

interface Props {
  closeChat: ClickEventHandler;
  openGroupInfoDialog: ClickEventHandler;
  openViewProfileDialog: ClickEventHandler;
  hideEmojiPicker: ClickEventHandler;
  CustomTooltip: CustomTooltipType;
}

const MsgsHeader = ({
  closeChat,
  openGroupInfoDialog,
  openViewProfileDialog,
  hideEmojiPicker,
  CustomTooltip,
}: Props) => {
  const { loggedInUser, selectedChat,selectedCall } = useAppSelector(selectAppState);
  const dispatch = useAppDispatch();
  const chatName = selectedChat?.isGroupChat
    ? selectedChat?.chatName
    : getOneToOneChatReceiver(loggedInUser, selectedChat?.users)?.name;

  const videoCall = () => {
    console.log('clicked');
    console.log(selectedChat);
    dispatch(setSelectedCall(selectedChat));
  };

  const closeCall = ()=>{
    dispatch(setSelectedCall(null));
  }

  return (
    <section
      className={`messagesHeader pointer-event d-flex justify-content-start position-relative w-100 fw-bold py-2`}
      onClick={hideEmojiPicker}
    >
      <CustomTooltip title="Go Back" placement="bottom-start" arrow>
        <IconButton
          onClick={closeChat}
          className={`d-flex ms-3`}
          sx={{
            color: "#999999",
            ":hover": { backgroundColor: "#aaaaaa20" },
          }}
        >
          <ArrowBack style={{color : "#77828d"}}/>
        </IconButton>
      </CustomTooltip>
      
      <CustomTooltip
        title={selectedChat?.isGroupChat ? "Group Info" : "View Profile"}
        placement="bottom-start"
        arrow
      >
        <IconButton
          sx={{
            margin: "-8px",
            ":hover": { backgroundColor: "#aaaaaa20" },
          }}
          className="pointer ms-0 ms-md-4"
          onClick={
            selectedChat?.isGroupChat
              ? openGroupInfoDialog
              : openViewProfileDialog
          }
        >
          <Avatar
            src={
              selectedChat?.isGroupChat
                ? selectedChat?.chatDisplayPic
                : getOneToOneChatReceiver(loggedInUser, selectedChat?.users)
                    ?.profilePic || ""
            }
            alt={"receiverAvatar"}
          />
        </IconButton>
      </CustomTooltip>

      <span className="ms-2 mt-1 fs-5" title={chatName} style={{color : "#77828d"}}>
        {truncateString(chatName, 22, 17)}
      </span>

      {/* {(!selectedChat?.isGroupChat && !selectedCall) &&
      <CustomTooltip title="Video Call friend" placement="bottom-end" arrow>
        <IconButton
          onClick={videoCall}
          className="d-flex"
          sx={{
            position: "absolute",
            right: 15,
            top: 8,
            color: "#999999",
            ":hover": { backgroundColor: "#aaaaaa20" },
          }}
        >
          <VideoCallOutlined />
        </IconButton>
      </CustomTooltip>
      } */}

      {selectedCall && 
      <CustomTooltip title="Close Chat" placement="bottom-end" arrow>
        <IconButton
          onClick={closeCall}
          className="d-flex"
          sx={{
            position: "absolute",
            right: 15,
            top: 8,
            color: "#999999",
            ":hover": { backgroundColor: "#aaaaaa20" },
          }}
        >
          <Close />
        </IconButton>
      </CustomTooltip>
    }
    </section>
  );
};

export default MsgsHeader;
