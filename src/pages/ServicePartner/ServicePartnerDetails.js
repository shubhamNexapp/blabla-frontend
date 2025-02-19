import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Container } from "@mui/material";
import Select from "react-select";
import FeatherIcon from "feather-icons-react";

import { useNavigate } from "react-router-dom";
import { Row, Card, CardBody, CardHeader, Button } from "reactstrap";

import {
  LoaderHide,
  LoaderShow,
  ticketNameStyle,
} from "../../helpers/common_constants";
import { getAPI, postAPI } from "../../Services/Apis";
import { toast } from "react-toastify";
import loader from "../../assets/images/instaone-loader.svg";

const ServicePartnerDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(location?.state);
  const [allService, setAllService] = useState([]);
  const [selectedService, setSelectedService] = useState([]);
  const [showServices, setShowServices] = useState(false);

  const back = () => {
    navigate(`/admin/service-partner`);
  };

  const cancelAddServices = () => {
    setShowServices(false);
  };

  useEffect(() => {
    getAllService();
  }, []);

  const getAllService = async () => {
    try {
      const response = await getAPI("service/get-service");
      if (response.statusCode === 200) {
        const serviceOptions = response.data.map((item) => ({
          label: item.serviceName, // label to display in the dropdown
          value: item._id, // value associated with the service
        }));
        setAllService(serviceOptions);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleServiceChange = (selectedOptions) => {
    const selectedServiceNames = selectedOptions.map((option) => option.label); // Extract the labels (service names)
    setSelectedService(selectedServiceNames); // Store the service names
  };

  const updatedAllService = allService.filter(
    (service) =>
      !user.servicesProvided.some(
        (userLabel) => userLabel.toLowerCase() === service.label.toLowerCase()
      )
  );

  const addMoreServices = () => {
    setShowServices(true);
  };

  const addServices = async () => {
    try {
      LoaderShow();
      const data = {
        userId: user?.userId,
        servicesProvided: selectedService,
      };
      if (selectedService.length > 0) {
        const response = await postAPI("user/add-services-admin", data);
        if (response.statusCode === 200) {
          toast.success(response.message);
          navigate(`/admin/service-partner`);
          LoaderHide();
        } else {
          LoaderHide();
          toast.error(response.message);
        }
      } else {
        toast.error("Please select atleast one service to add");
        LoaderHide();
      }
    } catch (error) {
      LoaderHide();
    }
  };

  return (
    <React.Fragment>
      <div
        id="hideloding"
        className="loding-display"
        style={{ display: "none" }}
      >
        <img src={loader} alt="loader-img" />
      </div>
      <div className="page-content">
        <Container style={{ marginTop: "10px" }}>
          <Row>
            <div className="col-12">
              <Card>
                <CardHeader>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h2 style={ticketNameStyle}>
                      {user?.role === "company" ? (
                        <>{user?.companyName}</>
                      ) : (
                        <>
                          {user?.firstName} {user?.lastName}
                        </>
                      )}
                    </h2>
                  </div>
                </CardHeader>
                <CardBody>
                  <dl className="row mb-0">
                    <dt className="col-sm-3">Email</dt>
                    <dd className="col-sm-9">{user?.email} </dd>
                    <dt className="col-sm-3">Phone</dt>
                    <dd className="col-sm-9">{user?.phone} </dd>
                    <dt className="col-sm-3">Role</dt>
                    <dd className="col-sm-9">{user?.role} </dd>
                    <dt className="col-sm-3">User ID</dt>
                    <dd className="col-sm-9">{user?.userId} </dd>
                    <dt className="col-sm-3">Identify Proof</dt>
                    <dd className="col-sm-9">{user?.identityProof} </dd>
                    <dt className="col-sm-3">Location</dt>
                    <dd
                      className="col-sm-9"
                      style={{ maxHeight: "150px", overflowY: "auto" }}
                    >
                      {user?.locationData?.map((e, index) => (
                        <div key={index}>{e?.name || e.city}</div>
                      ))}
                    </dd>
                    <dt className="col-sm-3">Services Provided</dt>
                    <dd className="col-sm-9">
                      {user?.servicesProvided?.map((e) => (
                        <div>{e}</div>
                      ))}{" "}
                      <div
                        style={{ cursor: "pointer" }}
                        size="sm"
                        onClick={addMoreServices}
                      >
                        <FeatherIcon icon="plus" />
                      </div>
                      {showServices && (
                        <div className="col-lg-6">
                          <div className="mb-3 mt-3">
                            <Select
                              isMulti
                              options={updatedAllService} // Dynamically updated service options
                              className="basic-multi-select"
                              classNamePrefix="select"
                              onChange={handleServiceChange} // Call when services are selected
                            />
                          </div>
                          <div className="d-flex flex-wrap gap-2">
                            <Button
                              className="mr-2"
                              onClick={addServices}
                              color="success"
                            >
                              Add
                            </Button>
                            <Button
                              onClick={cancelAddServices}
                              color="secondary"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </dd>
                    <dt className="col-sm-3">
                      <button onClick={back} className="btn btn-info">
                        Back
                      </button>
                    </dt>
                  </dl>
                </CardBody>
              </Card>
            </div>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ServicePartnerDetails;
