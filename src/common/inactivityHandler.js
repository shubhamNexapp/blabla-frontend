import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InactivityHandler = ({ children }) => {
  const navigate = useNavigate();
  let logoutTimer;
  let warningTimer;

  const logoutUser = () => {
    localStorage.removeItem("authUser"); // Clear user session
    navigate("/homepage"); // Redirect to home page
  };

  // Function to show warning toast message before logout
  const showWarning = () => {
    toast.warning("Your session is about to expire due to inactivity.");
  };

  // Function to reset the timers
  const resetTimers = () => {
    clearTimeout(logoutTimer); // Clear the previous logout timer
    clearTimeout(warningTimer); // Clear the previous warning timer

    // Set a new warning timer (50 seconds) and logout timer (60 seconds)
    // warningTimer = setTimeout(showWarning, 3540000); // Show warning at 59 minutes
    logoutTimer = setTimeout(logoutUser, 3600000); // Log out at 60 minutes (60 * 60 * 1000 ms)
  };

  // Set up event listeners for user activity
  useEffect(() => {
    window.addEventListener("mousemove", resetTimers);
    window.addEventListener("keypress", resetTimers);
    window.addEventListener("click", resetTimers);

    // Initialize timers on component mount
    resetTimers();

    // Cleanup event listeners and timers on component unmount
    return () => {
      clearTimeout(logoutTimer);
      clearTimeout(warningTimer);
      window.removeEventListener("mousemove", resetTimers);
      window.removeEventListener("keypress", resetTimers);
      window.removeEventListener("click", resetTimers);
    };
  }, []);

  return (
    <>
      {/* <ToastContainer /> */}
      {children}
    </>
  );
};

export default InactivityHandler;
