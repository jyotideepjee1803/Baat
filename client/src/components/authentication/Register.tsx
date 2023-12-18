// import { AddAPhoto } from "@mui/icons-material";
import { useState, useRef, ChangeEventHandler, LegacyRef } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import { CircularProgress } from "@mui/material";
import PasswordVisibilityToggle from "../utils/PasswordVisibilityToggle";
import { getAxiosConfig, isImageFile, TWO_MB } from "../../utils/appUtils";
import {
  selectFormfieldState,
  setLoading,
} from "../../store/slices/FormfieldSlice";
import { displayToast } from "../../store/slices/ToastSlice";
import { setLoggedInUser } from "../../store/slices/AppSlice";
import {
  AxiosErrorType,
  ClickEventHandler,
  ToastData,
} from "../../utils/AppTypes";
import { useAppDispatch, useAppSelector } from "../../store/storeHooks";
import { AxiosRequestConfig } from "axios";

const DEFAULT_USER_DP = process.env.REACT_APP_DEFAULT_USER_DP;

interface UserData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  profilePic: Blob | string;
  profilePicUrl: string | undefined;
}

const Register = () => {
  const {
    loading,
    disableIfLoading,
    formLabelClassName,
    formFieldClassName,
    inputFieldClassName,
    btnSubmitClassName,
  } = useAppSelector(selectFormfieldState);

  const dispatch = useAppDispatch();
  const navigate: NavigateFunction = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  // const imgInput = useRef<HTMLInputElement>();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePic: "",
    profilePicUrl: DEFAULT_USER_DP,
  } as UserData);

  const { name, email, password, confirmPassword, profilePic, profilePicUrl } =
    userData;

  const handleChangeFor =
    (prop: string): ChangeEventHandler<HTMLInputElement> =>
    (e) => {
      setUserData({ ...userData, [prop]: e.target.value });
    };

  const handleRegister: ClickEventHandler = async (e) => {
    e.preventDefault();
    // return dispatch(setLoading(true));

    if (!name || !email || !password || !confirmPassword) {
      return dispatch(
        displayToast({
          message: "Please Enter All the Fields",
          type: "warning",
          duration: 3000,
          position: "bottom-center",
        } as ToastData)
      );
    }

    if (name.length > 25) {
      return dispatch(
        displayToast({
          message: "Name Must be Less than 25 characters",
          type: "warning",
          duration: 3000,
          position: "bottom-center",
        } as ToastData)
      );
    }

    // Validate email
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return dispatch(
        displayToast({
          message: "Please Enter a Valid Email ID",
          type: "warning",
          duration: 3000,
          position: "bottom-center",
        } as ToastData)
      );
    }

    if (password !== confirmPassword) {
      return dispatch(
        displayToast({
          message: "Passwords Do Not Match",
          type: "warning",
          duration: 3000,
          position: "bottom-center",
        } as ToastData)
      );
    }
    dispatch(setLoading(true));
    const config = getAxiosConfig({ formData: true });

    const formData = new FormData();
    formData.append("profilePic", profilePic);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    console.log(formData);
    
    try {
      const { data } = await axios.post(
        "/api/user/register",
        formData,
        config as AxiosRequestConfig
      );
      // Success toast : register successful
      dispatch(
        displayToast({
          title: "Registration Successful",
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
          title: "Registration Failed",
          message:
            (error as AxiosErrorType).response?.data?.message ||
            (error as Error).message,
          type: "error",
          duration: 4000,
          position: "bottom-center",
        } as ToastData)
      );
      dispatch(setLoading(false));
    }
  };

  // const handleImgInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
  //   if (!e || !e.target || !e.target.files) return;
  //   const image = e.target.files[0];
  //   if (!image) return;

  //   if (!isImageFile(image.name)) {
  //     return dispatch(
  //       displayToast({
  //         title: "Invalid Image File",
  //         message: "Please Select an Image File (png/jpg/jpeg/svg/webp)",
  //         type: "warning",
  //         duration: 5000,
  //         position: "bottom-center",
  //       } as ToastData)
  //     );
  //   }

  //   if (image.size >= TWO_MB) {
  //     if (!imgInput || !imgInput.current) return;
  //     imgInput.current.value = "";
  //     return dispatch(
  //       displayToast({
  //         message: "Please Select an Image Smaller than 2 MB",
  //         type: "warning",
  //         duration: 3000,
  //         position: "bottom-center",
  //       } as ToastData)
  //     );
  //   }
  //   setUserData({
  //     ...userData,
  //     profilePic: image,
  //     profilePicUrl: URL.createObjectURL(image),
  //   });
  // };

  return (
    <>    
    <form
      className={`app__form justify-content-center user-select-none row ${disableIfLoading}`}
      style={{ pointerEvents: loading ? "none" : "auto" }}
    >
      {/* Name input */}
      <section className={`${formFieldClassName} col-7 order-md-1`}>
        <label htmlFor="register__username" className={`${formLabelClassName}`}>
        </label>
        <input
          type="text"
          value={name}
          onChange={handleChangeFor("name")}
          required
          name="username"
          id="register__username"
          className={`${inputFieldClassName}`}
          placeholder="User Name"
        />
      </section>
      {/* Email input */}
      <section className={`${formFieldClassName} col-7 order-md-2`}>
        <label htmlFor="register__email" className={`${formLabelClassName}`}>
        </label>
        <input
          type="email"
          value={email}
          onChange={handleChangeFor("email")}
          required
          name="email"
          id="register__email"
          className={`${inputFieldClassName}`}
          placeholder="Email"
        />
      </section>
      {/* Password input */}
      <section className={`${formFieldClassName} col-7 order-md-3`}>
        <label htmlFor="register__password" className={`${formLabelClassName}`}>
        </label>
        <div className="input-group">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={handleChangeFor("password")}
            required
            name="password"
            id="register__password"
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
      {/* Confirm Password input */}
      <section className={`${formFieldClassName} col-7 mb-4 order-md-4`}>
        <label
          htmlFor="register__confirmpassword"
          className={`${formLabelClassName}`}
        >
        </label>
        <div className="input-group">
          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={handleChangeFor("confirmPassword")}
            required
            name="confirmpassword"
            id="register__confirmpassword"
            className={`${inputFieldClassName}`}
            placeholder="Confirm Password"
          />
          <PasswordVisibilityToggle
            disableIfLoading={disableIfLoading}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
        </div>
      </section>
      <section
        className={`${formFieldClassName} mb-4 d-flex col-7 justify-content-center order-5`}
      >
        {/* Register button */}
        <button
          type="submit"
          name="btnRegister"
          id="register__btnRegister"
          onClick={handleRegister}
          className={`${btnSubmitClassName}`}
        >
          {loading ? (
            <>
              <CircularProgress
                size={25}
                style={{ color: "white", margin: "0px 15px 0px -20px" }}
              />
              Signing Up...
            </>
          ) : (
            "Register"
          )}
        </button>
      </section>
      <section className="col-7 order-last">
      <p style={{color: "#08afe1"}}>Already have an account? <a href="/login" className="link-success">Sign in</a></p>
      </section>
    </form>
    </>
  );
};

export default Register;
