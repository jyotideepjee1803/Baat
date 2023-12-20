import {useEffect} from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import type { UserType } from "../utils/AppTypes";
import Loading from "../components/Loading";

const HomePage = () => {
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
    <div style={{ marginTop: 150 }}>
      <Loading/>
    </div>
  );
};

export default HomePage;
