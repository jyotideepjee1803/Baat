import { useRef } from "react";
import WelcomeAnimation from "../animations/welcome.json";
import { SpanRef } from "../utils/AppTypes";
import LottieAnimation from "./utils/LottieAnimation";

const SignBanner = () => {
  const letsChatGif = useRef<HTMLSpanElement>(null);
  return (
    <div className="d-flex flex-column justify-content-start align-items-center h-100">
      <LottieAnimation
        ref={letsChatGif as SpanRef}
        className={"d-inline-block mt-3"}
        style={{ marginBottom: 30, height: "100%" }}
        animationData={WelcomeAnimation}
      />
    </div>
  );
};

export default SignBanner;
