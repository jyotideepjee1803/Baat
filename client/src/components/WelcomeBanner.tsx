import { useRef } from "react";
import WelcomeAnimation from "../animations/welcome.json";
import { selectAppState } from "../store/slices/AppSlice";
import { useAppSelector } from "../store/storeHooks";
import { SpanRef } from "../utils/AppTypes";
import { truncateString } from "../utils/appUtils";
import LottieAnimation from "./utils/LottieAnimation";

const WelcomeBanner = ({ isNewUser }: { isNewUser: boolean }) => {
  const { loggedInUser } = useAppSelector(selectAppState);
  const letsChatGif = useRef<HTMLSpanElement>(null);
  return (
    <div className="d-flex flex-column justify-content-start align-items-center h-100">
      {!isNewUser && (
        <h2 className="mx-3 mt-1">
          Hello{" "}
          <span
            className="fw-bold"
            style={{ color: "#A798F2" }}
          >{`${truncateString(
            loggedInUser?.name?.split(" ")[0],
            12,
            9
          )?.toUpperCase()}`}</span>{" "}
          👋
        </h2>
      )}
      <LottieAnimation
        ref={letsChatGif as SpanRef}
        className={"d-inline-block mt-3"}
        style={{ marginBottom: 30, height: "70%" }}
        animationData={WelcomeAnimation}
      />
      <p className="h2" style={{ color: "#DDBEF9" }}>
        Happy Chatting!😀
      </p>
    </div>
  );
};

export default WelcomeBanner;
