import toast from "react-hot-toast";
import axiosInstance from "../api/axiosInstance";

let sessionInterval: number | null = null;
let isSessionExpired = false;

const validateSession = async () => {
  const token = localStorage.getItem("token");

  if (!token || isSessionExpired) return;

  try {
    // Session validation API
    await axiosInstance.get("/api/auth/check-session");

    console.log("Session active");
  } catch (error: any) {
    console.log("Session expired");

    // prevent multiple popup alerts
    if (isSessionExpired) return;

    isSessionExpired = true;

    toast.error(
      "Session expired / Login attempted on another device",
      {
        id: "sessionToast",
      }
    );

    alert(
      "Session expired / Login attempted on another device"
    );

    // clear session
    localStorage.removeItem("token");

    // stop interval
    if (sessionInterval) {
      clearInterval(sessionInterval);
      sessionInterval = null;
    }

    // redirect
    setTimeout(() => {
      window.location.replace("/");
    }, 1000);
  }
};

export const startSessionChecker = () => {
  if (sessionInterval) return;

  // check once immediately
  validateSession();

  //  every 1 minute
  sessionInterval = window.setInterval(() => {
    validateSession();
  }, 60000);

  // check when tab becomes active
  document.addEventListener(
    "visibilitychange",
    () => {
      if (
        document.visibilityState === "visible"
      ) {
        validateSession();
      }
    }
  );

  // sync logout between tabs
  window.addEventListener(
    "storage",
    (event) => {
      if (
        event.key === "token" &&
        !event.newValue
      ) {
        window.location.replace("/");
      }
    }
  );
};