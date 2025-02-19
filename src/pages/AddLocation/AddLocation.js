import React, { useState, useEffect } from "react";
import Select from "react-select";
import { State, City } from "country-state-city";
import loader from "../../assets/images/instaone-loader.svg";
import { LoaderHide, LoaderShow } from "../../helpers/common_constants";
import { toast } from "react-toastify";
import { postAPI } from "../../Services/Apis";
import axios from "axios";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import FeatherIcon from "feather-icons-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "reactstrap";
import { getUserDetails } from "../../common/utility";

const AddLocation = (props) => {
  const location = useLocation();
  console.log("location=======", location);
  document.title = "Instaone";

  const navigate = useNavigate();

  const userId = getUserDetails()?.userId;

  const [cityOptions, setCityOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [selectedStates, setSelectedStates] = useState([]);
  const [locationResults, setLocationResults] = useState([]);
  const [savedLocations, setSavedLocations] = useState([]);
  const [user, setUser] = useState();

  useEffect(() => {
    getUser();
    const data = State.getAllStates();
    const filteredNames = data
      .filter((item) => item.countryCode === "IN")
      .map((item) => ({
        value: item.isoCode,
        label: item.name,
      }));
    setStateOptions(filteredNames);
  }, []);

  const getUser = async () => {
    const data = { userId: userId };
    const response = await postAPI("auth/get-user", data);
    if (response.statusCode === 200) {
      setUser(response.data);
    }
  };

  const fetchCitiesForStates = async (stateCodes) => {
    const citiesArray = await Promise.all(
      stateCodes.map((stateCode) => City.getCitiesOfState("IN", stateCode))
    );
    const allCities = citiesArray.flat().map((city) => ({
      value: `${city.name},${stateCodes}`,
      label: city.name,
    }));
    setCityOptions(allCities);
  };

  useEffect(() => {
    if (selectedStates.length > 0) {
      const stateCodes = selectedStates.map((state) => state.value);
      fetchCitiesForStates(stateCodes);
    } else {
      setCityOptions([]);
    }
  }, [selectedStates]);

  const filteredData = locationResults?.filter(
    (item) =>
      item.country_code === "IND" &&
      selectedStates.some((state) => state.label === item.region)
  );

  const handleStateChange = (selectedOptions) => {
    setSelectedStates(selectedOptions);
  };

  const handleCityChangeOption = async (selectedOptions) => {
    try {
      LoaderShow();
      const data = { name: selectedOptions.label };

      const searchCity = await postAPI("auth/search-cities", data);

      if (searchCity.cities.length > 0) {
        LoaderHide();
        const saveCitiesData = searchCity.cities;
        setLocationResults(saveCitiesData);
      } else {
        const apiKey = "38011012ffb5e1eb2e20351bc1c89efb";
        const url = "https://api.positionstack.com/v1/forward";

        const response = await axios.get(url, {
          params: {
            access_key: apiKey,
            query: selectedOptions.label,
          },
        });

        const locations = response.data?.data || [];

        const saveCities = await postAPI("auth/save-cities", locations);
        LoaderHide();
        setLocationResults(locations);
      }
    } catch (error) {
      LoaderHide();
    }
  };

  const handleSaveLocation = (location) => {
    setSavedLocations((prev) => {
      const isDuplicate = prev.some(
        (loc) =>
          loc.latitude === location.latitude &&
          loc.longitude === location.longitude &&
          loc.name === location.name
      );

      if (!isDuplicate) {
        return [...prev, location];
      } else {
        return prev;
      }
    });
  };

  const handleDeleteLocation = (index) => {
    setSavedLocations((prev) => prev.filter((_, i) => i !== index));
  };

  const addLocations = async () => {
    try {
      LoaderShow();
      const filteredData = savedLocations.map(
        ({ latitude, longitude, name }) => ({
          latitude,
          longitude,
          name,
        })
      );

      if (filteredData.length > 0) {
        const data = {
          userId: userId,
          locationData: filteredData,
        };

        const response = await postAPI("auth/add-location", data);
        if (response.statusCode === 200) {
          toast.success(response.message);
          if (location.pathname === "/individual/add-location") {
            navigate("/individual/dashboard");
          } else {
            navigate("/company/dashboard");
          }
          LoaderHide();
          getUser();
        } else {
          LoaderHide();
          toast.error(response.message);
        }
      } else {
        toast.warning("Please select location");
        LoaderHide();
      }
    } catch (error) {
      LoaderHide();
      toast.error(error.message);
    }
  };

  const uniqueNames = [
    ...new Set(user?.locationData?.map((item) => item.name) ?? []),
  ];

  return (
    <React.Fragment>
      <div className="page-content">
        <div
          id="hideloding"
          className="loding-display"
          style={{ display: "none" }}
        >
          <img src={loader} alt="loader-img" />
        </div>
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <label style={{ marginBottom: "5px", fontWeight: "bold" }}>
              Saved Locations
            </label>
            <div
              style={{
                maxHeight: "100px",
                overflowY: "auto",
                border: "1px solid #ccc",
                padding: "5px",
                width: "150px",
                textAlign: "center",
              }}
            >
              {uniqueNames?.map((name, index) => (
                <div key={index} style={{ padding: "2px 0" }}>
                  {name}
                </div>
              ))}
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-lg-6">
              <div style={{ marginBottom: "100px" }}>
                <label
                  htmlFor="choices-multiple-default"
                  className="form-label font-size-13 text-muted"
                >
                  State
                </label>

                <Select
                  isMulti
                  options={stateOptions} // Use dynamically generated state options
                  className="basic-multi-select"
                  classNamePrefix="select"
                  onChange={handleStateChange} // Update selected states
                />
              </div>
            </div>

            <div className="col-lg-6">
              <div>
                <label
                  htmlFor="choices-multiple-default"
                  className="form-label font-size-13 text-muted"
                >
                  City
                </label>
                <Select
                  options={cityOptions}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  onChange={handleCityChangeOption}
                />
              </div>
            </div>

            <div className="row">
              {filteredData && filteredData.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Region</TableCell>
                        <TableCell>Label</TableCell>
                        <TableCell>latitude</TableCell>
                        <TableCell>longitude</TableCell>
                        <TableCell>Select</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredData.map((row, index) => {
                        const isSaved = savedLocations.some(
                          (loc) =>
                            loc.latitude === row.latitude &&
                            loc.longitude === row.longitude &&
                            loc.name === row.name
                        );
                        return (
                          <TableRow key={`${row.name}-${index}`}>
                            <TableCell component="th" scope="row">
                              {row.name}
                            </TableCell>
                            <TableCell align="right">{row.region}</TableCell>
                            <TableCell align="right">{row.label}</TableCell>
                            <TableCell align="right">{row.latitude}</TableCell>
                            <TableCell align="right">{row.longitude}</TableCell>
                            <TableCell align="right">
                              <span
                                onClick={() => handleSaveLocation(row)}
                                disabled={isSaved} // Disable if already saved
                                style={{
                                  color: isSaved ? "gray" : "rgb(39 175 7)",
                                  fontWeight: "600",
                                  cursor: isSaved ? "not-allowed" : "pointer",
                                }}
                              >
                                {isSaved ? "Selected" : "Select"}
                              </span>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                ""
              )}

              <div>
                {savedLocations.length > 0 && (
                  <div>
                    <br />
                    <h4>Saved Locations:</h4>
                    <ul>
                      {savedLocations.map((location, index) => (
                        <li key={index}>
                          {location.name} - {location.region}({location.label})
                          <span
                            onClick={() => handleDeleteLocation(index)}
                            style={{
                              margin: "5px",
                              cursor: "pointer",
                              color: "red",
                            }}
                          >
                            <FeatherIcon icon="x" />{" "}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
          {filteredData && filteredData.length > 0 ? (
            <Button
              color="success"
              className="mt-3 mb-3"
              onClick={addLocations}
            >
              Add Location
            </Button>
          ) : (
            ""
          )}
        </div>
      </div>
    </React.Fragment>
  );
};

export default AddLocation;
