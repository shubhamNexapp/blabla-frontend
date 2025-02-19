import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Dropdown, DropdownToggle, DropdownMenu } from "reactstrap";

//i18n
import { withTranslation } from "react-i18next";
// Redux
import { connect } from "react-redux";
import { Link } from "react-router-dom";

// users
import user1 from "../../../assets/images/users/avatar-1.jpg";
import Avatar from "react-avatar";

const ProfileMenu = (props) => {
  // Declare a new state variable, which we'll call "menu"
  const [menu, setMenu] = useState(false);


  const [username, setusername] = useState("Admin");

  useEffect(() => {
    if (localStorage.getItem("authUser")) {
      if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
        const obj = JSON.parse(localStorage.getItem("authUser"));
        setusername(obj.displayName);
      } else if (
        process.env.REACT_APP_DEFAULTAUTH === "fake" ||
        process.env.REACT_APP_DEFAULTAUTH === "jwt"
      ) {
        const obj = JSON.parse(localStorage.getItem("authUser"));
        setusername(obj.username);
      }
    }
  }, [props.success]);

  const logoutHandle = () => {
    localStorage.removeItem("authUser");
  };

  function getRole() {
    const authUser = localStorage.getItem("authUser");
    if (authUser) {
      const user = JSON.parse(authUser);
      console.log("login user", user);
      return user?.role;
    }
    return null;
  }
  // Example usage
  const role = getRole();

  let profileRoute;
  if (role == "admin") {
    profileRoute = "/admin/profile";
  } else if (role == "customer") {
    profileRoute = "/customer/profile";
  } else if (role == "company") {
    profileRoute = "/company/profile";
  } else {
    profileRoute = "/individual/profile";
  }

  return (
    <React.Fragment>
      <Dropdown
        isOpen={menu}
        toggle={() => setMenu(!menu)}
        className="d-inline-block"
      >
        <DropdownToggle
          className="btn header-item bg-soft-light border-start border-end"
          id="page-header-user-dropdown"
          tag="button"
        >
          <Avatar
            name="Instaone" // The user's full name or first name
            size="38" // The height of the avatar (80px)
            style={{ width: "38px" }} // Custom width for the avatar (70px)
            round={true} // Makes the avatar circular
            color="#ED8D21" // Custom background color
            fgColor="#fff" // Custom text color
          />

          <span className="d-none d-xl-inline-block ms-1 fw-medium">
            {username}
          </span>
          <i className="mdi mdi-chevron-down d-none d-xl-inline-block" />
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          <Link to={profileRoute} className="dropdown-item">
            <i className="mdi mdi mdi-face-man font-size-16 align-middle me-1"></i>{" "}
            {props.t("Profile")}{" "}
          </Link>{" "}
          {/* <Link to="/page-lock-screen" className="dropdown-item">
            <i className="mdi mdi-lock font-size-16 align-middle me-1"></i>
            {props.t("Lock screen")}
          </Link> */}
          <div className="dropdown-divider" />
          <Link to="/logout" className="dropdown-item">
            <i className="mdi mdi-logout font-size-16 align-middle me-1"></i>
            <span onClick={logoutHandle}>{props.t("Logout")}</span>
          </Link>
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

ProfileMenu.propTypes = {
  success: PropTypes.any,
  t: PropTypes.any,
};

const mapStatetoProps = (state) => {
  const { error, success } = state.Profile;
  return { error, success };
};

export default connect(mapStatetoProps, {})(withTranslation()(ProfileMenu));
