import { ChangeEventHandler, useState } from "react";
import axios from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import PasswordVisibilityToggle from "../utils/PasswordVisibilityToggle";
import { setLoggedInUser } from "../../store/slices/AppSlice";
import {
  selectFormfieldState,
  setLoading,
} from "../../store/slices/FormfieldSlice";
import { displayToast } from "../../store/slices/ToastSlice";
import { getAxiosConfig } from "../../utils/appUtils";
import { useAppDispatch, useAppSelector } from "../../store/storeHooks";
import {
  AxiosErrorType,
  ClickEventHandler,
  ToastData,
} from "../../utils/AppTypes";
import { AxiosRequestConfig } from "axios";

const Login = () => {
  const {
    loading,
    disableIfLoading,
    formLabelClassName,
    formFieldClassName,
    inputFieldClassName,
    btnSubmitClassName,
    btnResetClassName,
  } = useAppSelector(selectFormfieldState);

  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [userCredentials, setUserCredentials] = useState({
    email: "",
    password: "",
  });
  const { email, password } = userCredentials;

  const handleChangeFor =
    (prop: string): ChangeEventHandler<HTMLInputElement> =>
    (e) => {
      setUserCredentials({
        ...userCredentials,
        [prop]: e.target.value,
      });
    };

  const handleLogin: ClickEventHandler = async (e) => {
    e.preventDefault();
    // return dispatch(setLoading(true));
    if (!email || !password) {
      return dispatch(
        displayToast({
          message: "Please Enter All the Fields",
          type: "warning",
          duration: 5000,
          position: "bottom-center",
        } as ToastData)
      );
    }
    dispatch(setLoading(true));
    const config = getAxiosConfig({});
    try {
      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config as AxiosRequestConfig
      );
      // Success toast : login successful
      dispatch(
        displayToast({
          title: "Login Successful",
          message: "Your login session will expire in 15 days",
          type: "success",
          duration: 5000,
          position: "bottom-center",
        } as ToastData)
      );

      localStorage.setItem("loggedInUser", JSON.stringify(data));
      dispatch(setLoggedInUser(data));
      dispatch(setLoading(false));
      navigate("/chats");
    } catch (error) {
      dispatch(
        displayToast({
          title: "Login Failed",
          message:
            (error as AxiosErrorType).response?.data?.message ||
            (error as Error).message,
          type: "error",
          duration: 5000,
          position: "bottom-center",
        } as ToastData)
      );
      dispatch(setLoading(false));
    }
  };
  return (
    <div>
    <form
      className={`app__form justify-content-center alguser-select-none row`}
      style={{ pointerEvents: loading ? "none" : "auto" }}
    >
      {/* Email input */}
      <section className={`${formFieldClassName} mb-2 col-7`}>
        <label htmlFor="login__email" className={`${formLabelClassName}`}/>
        <input
          type="email"
          value={email}
          onChange={handleChangeFor("email")}
          required
          autoFocus
          name="email"
          id="login__email"
          className={`${inputFieldClassName}`}
          placeholder="Email"
        />
      </section>
      {/* Password input */}
      <section className={`${formFieldClassName} mb-4 col-7`}>
        <label htmlFor="login__password" className={`${formLabelClassName}`}/>
        <div className="input-group">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={handleChangeFor("password")}
            required
            name="password"
            id="login__password"
            className={`${inputFieldClassName}`}
            placeholder="Password"
          />
          <PasswordVisibilityToggle
            disableIfLoading={disableIfLoading}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
        </div>
      </section>
      <section
        className={`${formFieldClassName} col-7 mb-4 d-flex justify-content-center`}
      >
        {/* Login button */}
        <button
          type="submit"
          name="btnLogin"
          id="login__btnLogin"
          onClick={handleLogin}
          className={`${btnSubmitClassName}`}
        >
          {loading ? (
            <>
              <CircularProgress
                size={25}
                style={{ color: "white", margin: "0px 15px 0px -20px" }}
              />
              Signing in...
            </>
          ) : (
            "Login"
          )}
        </button>
      </section>
      <section className="col-7 order-last">
        <p style={{color: "#08afe1"}}>Don't have an account? <a href="/register" className="link-success">Sign up</a></p>
      </section>
      </form>
     
    </div>
  );
};

export default Login;
