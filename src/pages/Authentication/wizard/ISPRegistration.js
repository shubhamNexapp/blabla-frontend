import React, { useState } from "react";
import { CardBody, Card } from "reactstrap";
import { CardHeader } from "reactstrap";
import loader from "../../../assets/images/instaone-loader.svg";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import ClassARegister from "./ClassARegister";
import ClassBRegister from "./ClassBRegister";
import ClassCRegister from "./ClassCRegister";
import ChannelPartnerISPRegister from "./ChannelPartnerISPRegister";
import MSOISPRegister from "./MSOISPRegister";
import ProprietorISPRegister from "./ProprietorISPRegister";

const UserDetails = () => {
  const [joinee, setJoinee] = useState("Individual");
  const [selectedClass, setSelectedClass] = useState("tab1");

  const handleChange = (event) => {
    setSelectedClass(event.target.value);
  };

  const handleSelectionChange = (event) => {
    setJoinee(event.target.value);
    if (event.target.value === "Individual") {
      setSelectedClass("tab1");
    } else {
      setSelectedClass("tab4");
    }
  };

  const getMenuItems = () => {
    if (joinee === "Individual") {
      return [
        <MenuItem key="tab1" value="tab1">
          Channel Partner
        </MenuItem>,
        <MenuItem key="tab2" value="tab2">
          MSO
        </MenuItem>,
        <MenuItem key="tab3" value="tab3">
          Proprietor
        </MenuItem>,
      ];
    } else if (joinee === "Company") {
      return [
        <MenuItem key="tab4" value="tab4">
          Class A
        </MenuItem>,
        <MenuItem key="tab5" value="tab5">
          Class B
        </MenuItem>,
        <MenuItem key="tab6" value="tab6">
          Class C
        </MenuItem>,
      ];
    }
  };

  const renderFormComponent = () => {
    switch (selectedClass) {
      case "tab1":
        return <ChannelPartnerISPRegister />;
      case "tab2":
        return <MSOISPRegister />;
      case "tab3":
        return <ProprietorISPRegister />;
      case "tab4":
        return <ClassARegister />;
      case "tab5":
        return <ClassBRegister />;
      case "tab6":
        return <ClassCRegister />;
      default:
        return null; // Render nothing if no category is selected
    }
  };

  return (
    <React.Fragment>
      <Card className="registration-card">
        <CardHeader>
          <h4 className="card-title mb-0">ISP Registration</h4>
        </CardHeader>
        <div
          id="hideloding"
          className="loding-display"
          style={{ display: "none" }}
        >
          <img src={loader} alt="loader-img" />
        </div>
        <CardBody>
          <div id="basic-pills-wizard" className="twitter-bs-wizard">
            <div className="text-center mb-4">
              <h5>ISP Profile Details</h5>
              <p className="card-title-desc">Fill all information below</p>
            </div>
            <div
              className="my-3"
              style={{
                fontWeight: "400",
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
              }}
            >
              Joining as
              <label
                style={{
                  fontWeight: "400",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <input
                  type="radio"
                  value="Individual"
                  checked={joinee === "Individual"}
                  onChange={handleSelectionChange}
                />
                Individual
              </label>
              <label
                style={{
                  fontWeight: "400",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <input
                  type="radio"
                  value="Company"
                  checked={joinee === "Company"}
                  onChange={handleSelectionChange}
                />
                Company
              </label>
            </div>
            <form>
              <FormControl fullWidth>
                <InputLabel id="isp-class-select-label">
                  ISP Service Class
                </InputLabel>
                <Select
                  labelId="isp-class-select-label"
                  id="isp-class-select"
                  value={selectedClass}
                  onChange={handleChange}
                  label="ISP Service Class"
                  className="mb-4"
                >
                  <MenuItem value="" disabled>
                    Select a category
                  </MenuItem>
                  {getMenuItems()}
                </Select>
              </FormControl>

              {/* Render the form component dynamically based on the selected class */}
              {renderFormComponent()}
            </form>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default UserDetails;
