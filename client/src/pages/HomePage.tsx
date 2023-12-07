import {useEffect, useRef } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";

import LottieAnimation from "../components/utils/LottieAnimation";

import animationData from "../animations/chat-gif.json";

import type { SpanRef, UserType } from "../utils/AppTypes";

const HomePage = () => {
  const appGif = useRef<HTMLSpanElement>();
  const navigate: NavigateFunction = useNavigate();

  useEffect(() => {
    // localStorage persists data even after page refresh, unlike state
    const user: UserType = JSON.parse(
      localStorage.getItem("loggedInUser") as string
    );
    if (user && Date.now() < user.expiryTime) navigate("/chats");

    else navigate("/login");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="homepage container-fluid d-flex flex-column p-4">
      
        <LottieAnimation
          ref={appGif as SpanRef}
          className={"d-inline-block me-2"}
          style={{ width: "35px", height: "35px" }}
          animationData={animationData}
        />
    </section>
  );
};

export default HomePage;
