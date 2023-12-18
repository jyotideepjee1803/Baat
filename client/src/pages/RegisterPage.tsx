import {useEffect} from 'react'
import Register from '../components/authentication/Register'
import { useNavigate,NavigateFunction } from 'react-router-dom';
import { selectFormfieldState } from "../store/slices/FormfieldSlice";
import { useAppSelector } from "../store/storeHooks";
import type {UserType} from "../utils/AppTypes";
import SignBanner from '../components/SignBanner';

function RegisterPage() {
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
        <div className="bannerDiv col-6">
        <SignBanner/>
        </div>
        <div className="homepage container-fluid d-flex align-items-center justify-content-center flex-column p-4 col-lg-6">
          <section
            className={`app__body chatpage container p-2 mb-2 ${disableIfLoading}`}
          >
            <section
              className={`app__form text-light p-2 ${disableIfLoading}`}
            >
               <Register/>
            </section>
        </section>
        </div>
      </div>
    </div>
    )
}

export default RegisterPage