import { toast } from "react-toastify";
import PasskeyContext from "./PasskeyContext.jsx";
import { useEffect, useState } from "react";
import LoadingBar from 'react-top-loading-bar'
import { useNavigate } from "react-router-dom";

const PasskeyState = (props) => {
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URI;

  const [passwordData, setPasswordData] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [isLogin, setIsLogin] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isTrue, setIsTrue] = useState(false);
  const [form, setForm] = useState({ site: "", username: "", password: "" });
  const [isUpdate, setIsUpdate] = useState(false);
  const [id, setId] = useState("");

  const fetchPassword = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_URL}/api/passkey/fetchPassword`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      }
      );

      const data = await response.json();

      if (response.ok) {
        setPasswordData(data.passkeys);
      } else {
        if (data.errors && Array.isArray(data.errors)) {
          data.errors.forEach((error) => {
            toast.error(error.msg);
          });
        } else {
          toast.error(data.message || "Something went wrong");
        }
        setPasswordData([]);
      }

    } catch (error) {
      console.log("Failed to fetch Bookmark", error);
    } finally {
      setLoading(false);
    }
  };

  const checkLogin = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/checkLogin`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      })

      const data = await response.json();

      if (response.ok) {
        setUserInfo(data.userInfo);
        setIsLogin(true);
      }
      else {
        toast.error(data.message || "Something went wrong");
      }

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    checkLogin();
  }, [])

  return (
    <PasskeyContext.Provider value={{ progress, setProgress, BACKEND_URL, navigate, loading, setLoading, isTrue, setIsTrue, userInfo, setUserInfo, checkLogin, isLogin, setIsLogin, passwordData, fetchPassword, form, setForm, isUpdate, setIsUpdate, id, setId, setPasswordData }}>
      <LoadingBar color="#3b82f6" progress={progress} onLoaderFinished={() => setProgress(0)} />
      {props.children}
    </PasskeyContext.Provider>
  )
}

export default PasskeyState;