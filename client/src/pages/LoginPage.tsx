import {useEffect } from "react";
import Login from "../components/authentication/Login";

import { selectFormfieldState } from "../store/slices/FormfieldSlice";
import { useAppSelector } from "../store/storeHooks";
import { NavigateFunction, useNavigate } from "react-router-dom";

import type {UserType} from "../utils/AppTypes";
import SignBanner from "../components/SignBanner";

function LoginPage() {
    
    const navigate: NavigateFunction = useNavigate();
    const { disableIfLoading } = useAppSelector(selectFormfieldState);

    useEffect(() => {
        // localStorage persists data even after page refresh, unlike state
        const user: UserType = JSON.parse(
          localStorage.getItem("loggedInUser") as string
        );
        if (user && Date.now() < user.expiryTime) navigate("/chats");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div className="d-flex align-items-center justify-content-center">
        <div className={`flex row justify-content-center p-4`}>
          <div className="col-6 bannerDiv">
          <SignBanner/>
          </div>
          <div className="homepage container-fluid d-flex align-items-center justify-content-center flex-column p-4 col-lg-6">
            <section
              className={`app__body chatpage container p-2 mb-2 ${disableIfLoading}`}
            >
              <section
                className={`app__form text-light p-2 ${disableIfLoading}`}
              >
                  <Login/>
              </section>
          </section>
          </div>
        </div>
      </div>
    )
}

export default LoginPage