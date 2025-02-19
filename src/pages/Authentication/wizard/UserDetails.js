import React, { useEffect, useState } from "react";
import {
  CardBody,
  Form,
  NavItem,
  TabContent,
  TabPane,
  NavLink,
  UncontrolledTooltip,
  Card,
  CardHeader,
  FormFeedback,
} from "reactstrap";
import {
  Button,
  FormGroup,
  Modal,
  Input,
  Row,
  Col,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from "reactstrap";
import { State, City } from "country-state-city";
import { Banks } from "../../../constants/ObjectData";
import Select from "react-select";
import classnames from "classnames";
import { Link, useNavigate } from "react-router-dom";
// Formik Validation
import * as Yup from "yup";
import { FieldArray, useFormik } from "formik";
import { getAPI, postAPI } from "../../../Services/Apis";
import { toast } from "react-toastify";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import loader from "../../../assets/images/instaone-loader.svg";
import { LoaderHide, LoaderShow } from "../../../helpers/common_constants";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import FeatherIcon from "feather-icons-react";

const UserDetails = () => {
  const [activeTab, setactiveTab] = useState(1);
  const [joinee, setJoinee] = useState("Individual");

  const [load, setLoad] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  const [adharModal, setAdharModal] = useState(false);
  const toggleAdharModal = () => setAdharModal(!adharModal);
  const getPhoneNumber = JSON.parse(localStorage?.getItem("registerNumber"));
  const getpassword = JSON.parse(localStorage?.getItem("registerPassword"));

  // Multiple GST
  const [fields, setFields] = useState([{ state: "", gstNumber: "" }]);
  const [isMsmeChecked, setIsMsmeChecked] = useState(false);
  const [isMoreGstChecked, setIsMoreGstChecked] = useState(false);
  const [moreGstChecked, setMoreGstChecked] = useState(false);
  const [userpassword, setUserpassword] = useState({
    password: getpassword.password,
  });

  const [formData, setFormData] = useState({
    phone: getPhoneNumber.phone,
    password: getpassword.password,
    email: "",
    firstName: "",
    lastName: "",
    identityProof: "",
    identificationNumber: "",
    address: "",
  });
  const ValueChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const [isGstCheck, setIsGstCheck] = useState(false);

  const GSTCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setIsGstCheck(isChecked);

    if (!isChecked) {
      // Clear the gstNumber field when unchecked
      setCompanyData((prevData) => ({
        ...prevData,
        gstNumber: "",
      }));
    }
  };

  const [msmeFile, setMsmeFile] = useState(null);

  const [companyData, setCompanyData] = useState({
    companyName: "",
    sourceSupply: "",
    phone: getPhoneNumber.phone,
    email: "",
    password: getpassword.password,
    gstNumber: "",
  });
  const companyValueChange = (e) =>
    setCompanyData({ ...companyData, [e.target.name]: e.target.value });

  const handleSelectionChange = (event) => {
    setJoinee(event.target.value);
  };
  // State and Cities
  const [cityOptions, setCityOptions] = useState([]);
  const [stateOptions, setStateOptions] = useState([]);
  const [selectedStates, setSelectedStates] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);

  // MSME Upload File

  const [selectedFiles, setselectedFiles] = useState([]);
  const [allService, setAllService] = useState([]);
  const [selectedService, setSelectedService] = useState([]);
  const [selectedServiceCompany, setSelectedServiceCompany] = useState([]);

  function handleAcceptedFiles(event, setFieldValue) {
    const files = event.target.files; // Get the FileList from the input event
    const updatedFiles = Array.from(files).map((file) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    setselectedFiles(updatedFiles);
    setFieldValue("msmeImage", updatedFiles);
  }

  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  // SOS state
  const Statedata = State.getAllStates()
    .filter((item) => item.countryCode === "IN")
    .map((item) => ({
      value: item.isoCode,
      label: item.name,
    }));
  // State and City function ------
  useEffect(() => {
    const data = State.getAllStates();
    getAllService();
    const filteredNames = data
      .filter((item) => item.countryCode === "IN")
      .map((item) => ({
        value: item.isoCode,
        label: item.name,
      }));
    setStateOptions(filteredNames);
  }, []);

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

  const handleStateChange = (selectedOptions) => {
    setSelectedStates(selectedOptions);
  };

  const [locationResults, setLocationResults] = useState([]);
  const [savedLocations, setSavedLocations] = useState([]);

  const filteredData = locationResults?.filter(
    (item) =>
      item.country_code === "IND" &&
      selectedStates.some((state) => state.label === item.region)
  );

  const handleCityChange = async (selectedOptions) => {
    setSelectedCities(selectedOptions);
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

  const handleServiceChange = (selectedOptions) => {
    const selectedServiceNames = selectedOptions.map((option) => option.label); // Extract the labels (service names)
    setSelectedService(selectedServiceNames); // Store the service names
  };

  const handleServiceChangeCompany = (selectedOptions) => {
    const selectedServiceNames = selectedOptions.map((option) => option.label); // Extract the labels (service names)
    setSelectedServiceCompany(selectedServiceNames); // Store the service names
  };

  // State and City function ------
  const [bankDetails, setBankDetails] = useState({
    bankName: "",
    accountHolderName: "",
    accountNumber: "",
    cnfmAccountNumber: "",
    ifscCode: "",
    accountType: "",
  });

  const BankValueChange = (e) => {
    const { name, value } = e.target;
    const updatedValue = name === "bankName" ? Banks[value] || "" : value; // Store full bank name
    setBankDetails({ ...bankDetails, [name]: updatedValue });
  };

  const MsmeCheckboxChange = (event) => {
    setIsMsmeChecked(event.target.checked);
  };

  const MoreGSTCheckboxChange = (event) => {
    setIsMoreGstChecked(event.target.checked);
    MoreGSTCheck();
  };

  const MoreGSTCheck = () => {
    // setMoreGstChecked(!moreGstChecked);
    setMoreGstChecked(!moreGstChecked);
    setFields([""]);
  };

  // Add more Gst----------

  const handleAddField = () => {
    setFields([...fields, { state: "", gstNumber: "" }]);
  };

  const handleRemoveField = (index) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
  };

  const handleGST = (index, event) => {
    const newFields = fields.map((field, i) => {
      if (i === index) {
        return { ...field, [event.target.name]: event.target.value };
      }
      return field;
    });
    setFields(newFields);
  };

  // Add more Gst----------

  let navigate = useNavigate();
  const reDirect = () => {
    navigate("/login");
  };
  const msmefileUpload = (e) => {};

  const IndividualValidationSchemas = {
    1: Yup.object().shape({
      formData: Yup.object().shape({
        firstName: Yup.string()
          .required("First Name is required")
          .min(2, "First Name must be at least 2 characters long")
          .max(20, "First Name must not exceed 20 characters")
          .matches(/^[A-Za-z]+$/, "First Name can only contain letters"), // No spaces allowed
        lastName: Yup.string()
          .required("Last Name is required")
          .min(2, "Last Name must be at least 2 characters long")
          .max(20, "Last Name must not exceed 20 characters")
          .matches(
            /^[A-Za-z]+$/,
            "Last Name can only contain letters and spaces"
          ),
        phone: Yup.string()
          .required("Mobile Number is required")
          .matches(/^[0-9]{10}$/, "Must be a valid 10-digit mobile number"),
        email: Yup.string()
          .required("Email required")
          .email("Must be a valid email"),
        identificationNumber: Yup.string().required(
          "Identification Number is required"
        ),
        address: Yup.string().required("Address Number is required"),

        identityProof: Yup.string().required("identity Proof is required"),
      }),
    }),
    2: Yup.object().shape({
      selectedStates: Yup.array()
        .min(1, "At least one state is required")
        .required("This field is required"),
      // selectedCities: Yup.array()
      //   .min(1, "At least one city is required")
      //   .required("This field is required"),
      selectedService: Yup.array()
        .min(1, "At least one service is required")
        .required("This field is required"),
    }),
  };

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      user: "Service Partner",
      role: "individual",
      formData,
      bankDetails,
      selectedStates,
      selectedCities,
      selectedService,
      msmeImage: [],
    },
    validationSchema: Yup.object({
      bankDetails: Yup.object().shape({
        bankName: Yup.string().required("Bank Name is required"),
        accountHolderName: Yup.string().required(
          "Account Holder Name is required"
        ),

        accountNumber: Yup.string().required("Account Number is required"),
        cnfmAccountNumber: Yup.string()
          .required("Confirm Account Number  is required")
          .oneOf(
            [Yup.ref("accountNumber"), null],
            "Account Number  must match"
          ),
        ifscCode: Yup.string()
          .required("IFSC Code is required")
          .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC Code"),
        accountType: Yup.string().required("account Type  is required"),
      }),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {

        const filteredData = savedLocations.map(
          ({ latitude, longitude, name }) => ({
            latitude,
            longitude,
            name,
          })
        );

        const data = {
          role: values.role,
          firstName: values.formData.firstName,
          lastName: values.formData.lastName,
          email: values.formData.email,
          phone: values.formData.phone,
          password: values.formData.password,
          identityProof: values.formData.identityProof,
          identificationNumber: values.formData.identificationNumber,
          address: values.formData.address,
          bankDetails: values.bankDetails,
          state: values.selectedStates,
          city: values.selectedCities,
          locationData: filteredData,
          servicesProvided: selectedService, // Sending selected service IDs
        };

        const response = await postAPI("auth/register", data);
        if (response.statusCode === 200) {
          resetForm();
          toast.success("Registration done");
          localStorage.removeItem("registerNumber");
          localStorage.removeItem("registerPassword");

          navigate("/login");
        }
      } catch (error) {
        toast.error(error.message);
      }
    },
  });

  async function getCoordinatesForAddresses(addresses) {
    const apiKey = "FANgz5SPPeXsGdtDz2c3X1k4NzGejJLAK3CcTubL";
    const url = "https://api.olamaps.io/places/v1/geocode";

    const requests = addresses.map(async (address) => {
      try {
        const response = await axios.get(url, {
          params: {
            address: address,
            api_key: apiKey,
          },
          headers: {
            "X-Request-Id": uuidv4(),
          },
        });

        if (response.data) {
          return response.data;
        }
      } catch (error) {
        return null;
      }
    });

    // Wait for all requests to complete
    const results = await Promise.all(requests);

    const locationData = results.map((item) => {
      const {
        name,
        geometry: { location },
      } = item.geocodingResults[0];
      return {
        city: name,
        latitude: location.lat,
        longitude: location.lng,
      };
    });

    return locationData;
  }
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
    } catch (error) {}
  };

  const CompanyValidationSchemas = {
    1: Yup.object().shape({
      companyData: Yup.object().shape({
        companyName: Yup.string().required("Company Name is required"),
        sourceSupply: Yup.string().required("Source of supply is required"),
        phone: Yup.string()
          .required("Mobile Number is required")
          .matches(/^[0-9]{10}$/, "Must be a valid 10-digit mobile number"),
        email: Yup.string()
          .email("Must be a valid email")
          .required("Emaol is required"),
        // gstNumber: Yup.string().required("GST Number is required"),
        // msmefiles: Yup.string().required("MSME F is required")
      }),
    }),

    2: Yup.object().shape({
      selectedStates: Yup.array()
        .min(1, "At least one state is required")
        .required("This field is required"),
      // selectedCities: Yup.array()
      //   .min(1, "At least one city is required")
      //   .required("This field is required"),
      selectedService: Yup.array()
        .min(1, "At least one service is required")
        .required("This field is required"),
    }),
  };

  const companyvalidation = useFormik({
    enableReinitialize: true,
    initialValues: {
      user: "Service Partner",
      role: "company",
      companyData,
      bankDetails,
      selectedStates,
      selectedCities,
      selectedService,
      fields,
      msmeImage: [],
    },
    validationSchema: Yup.object({
      bankDetails: Yup.object().shape({
        bankName: Yup.string().required("Bank Name is required"),
        accountHolderName: Yup.string().required(
          "Account Holder Name is required"
        ),

        accountNumber: Yup.string()
          .required("Account Number is required")
          .matches(/^[0-9]+$/, "Account Number must contain only digits")
          .min(8, "Account Number must be at least 8 digits")
          .max(20, "Account Number must not exceed 20 digits"),
        cnfmAccountNumber: Yup.string()
          .required("Confirm Account Number  is required")
          .oneOf(
            [Yup.ref("accountNumber"), null],
            "Account Number  must match"
          ),
        ifscCode: Yup.string()
          .required("IFSC Code is required")
          .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC Code"),
        accountType: Yup.string().required("account Type  is required"),
      }),
    }),

    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        LoaderShow();

        formData.append("role", values.role || "");
        formData.append("companyName", values.companyData?.companyName || "");
        formData.append("sourceSupply", values.companyData?.sourceSupply || "");
        formData.append("email", values.companyData?.email || "");
        formData.append("phone", values.companyData?.phone || "");
        formData.append("password", values.companyData?.password || "");
        formData.append("gstNumber", values.companyData?.gstNumber || "");
        // formData.append("servicesProvided", selectedService || []);

        // Append the services as individual items in FormData
        selectedService.forEach((service) => {
          formData.append("servicesProvided", service);
        });

        // Serialize objects before appending
        if (values.fields) {
          formData.append("gstFields", JSON.stringify(values.fields));
        }

        if (values.bankDetails) {
          formData.append("bankDetails", JSON.stringify(values.bankDetails));
        }

        if (values.selectedStates) {
          formData.append("state", JSON.stringify(values.selectedStates));
        }

        if (values.selectedCities) {
          formData.append("city", JSON.stringify(values.selectedCities));
        }

        // Handle file upload
        if (values.msmeImage && values.msmeImage.length > 0) {
          formData.append("msmeImage", values.msmeImage[0]);
        }

        const filteredData = savedLocations.map(
          ({ latitude, longitude, name }) => ({
            latitude,
            longitude,
            name,
          })
        );

        if (values?.selectedCities) {
          formData.append("locationData", JSON.stringify(filteredData));
        }

        const response = await postAPI("auth/register", formData);
        if (response.statusCode === 200) {
          toast.success(response.message);
          localStorage.removeItem("registerNumber");
          localStorage.removeItem("registerPassword");
          toast.success("Registration Done ");
          LoaderHide();
          resetForm();
          navigate("/login");
        }
      } catch (error) {
        LoaderHide();
        toast.error(error.message);
      }
    },
  });

  // Identification Proof API
  // State for verification status
  const [verificationStatus, setVerificationStatus] = useState({
    verified: false,
    error: "",
    loading: false,
  });

  const [showOtpPopup, setShowOtpPopup] = useState(false); // State to show/hide OTP popup
  const [otp, setOtp] = useState(""); // State for OTP input
  const [otpResponseData, setOtpResponseData] = useState(); // State for reference ID
  const [isVerify, setIsVerify] = useState(false);
  const [isGstVerify, setIsGstVerify] = useState(false);
  const sandboxToken = localStorage?.getItem("sandboxToken");

  const validateTab = async (tab) => {
    const schema = IndividualValidationSchemas[tab];
    if (schema) {
      try {
        await schema.validate(validation.values, { abortEarly: false });
        return true;
      } catch (error) {
        error.inner.forEach((err) => {
          validation.setFieldError(err.path, err.message);
        });
        return false;
      }
    }
    return true;
  };
  const companyValidateTab = async (tab) => {
    const schema = CompanyValidationSchemas[tab];
    if (schema) {
      try {
        await schema.validate(companyvalidation.values, { abortEarly: false });
        return true;
      } catch (error) {
        error.inner.forEach((err) => {
          companyvalidation.setFieldError(err.path, err.message);
        });
        return false;
      }
    }
    return true;
  };
  const toggleTab = async (tab) => {
    if (tab < 1 || tab > 3) return;
    if (joinee == "Individual") {
      if (isVerify) {
        if (tab > activeTab) {
          const isValid = await validateTab(activeTab);
          if (!isValid) return;
        }
        setactiveTab(tab);
      } else {
        toast.error("Identity proof verification is Compulsory");
      }
    } else {
      if (isGstCheck && isGstVerify) {
        if (tab > activeTab) {
          const isValid = await companyValidateTab(activeTab);
          if (!isValid) return;
        }
        setactiveTab(tab);
      } else if (!isGstCheck) {
        if (tab > activeTab) {
          const isValid = await companyValidateTab(activeTab);
          if (!isValid) return;
        }
        setactiveTab(tab);
      } else {
        toast.error("Please fill all details");
      }
    }
  };
  const handleSendOtp = async () => {
    try {
      if (formData.identityProof == "Pan Card") {
        toast.error("Select Aadhaar Card as Identity Proof.");
        return;
      }
      const aadhaarPattern = /^\d{12}$/;
      if (!aadhaarPattern.test(formData.identificationNumber)) {
        toast.error("Invalid Aadhaar number. It must be 12 numeric digits.");
        return;
      }

      LoaderShow();
      const data = {
        aadhaar_number: formData.identificationNumber,
        token: sandboxToken,
      };
      const response = await postAPI("auth/aadhar-send-request", data);
      if (response.code === 200) {
        LoaderHide();
        toast.success(response.message);
        setOtpResponseData(response.data.reference_id);
        setAdharModal(true);
      }
      LoaderHide();
    } catch (error) {
      LoaderHide();
    }
  };

  // Handle OTP submission
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const otp = document.getElementById("otp").value;
      if (!otp.trim()) {
        toast.error("Please enter the OTP.");
        return; // Stop further processing
      }
      LoaderShow();
      const data = {
        reference_id: otpResponseData,
        token: sandboxToken,
        otp: otp,
      };
      const response = await postAPI("auth/aadhar-verify-request", data);

      if (response.code === 200) {
        LoaderHide();
        setIsVerify(true);
        toggleAdharModal();
        toast.success(response.message);
      } else {
        toast.error(response.message);
        toggleAdharModal();

        LoaderHide();
      }
    } catch (err) {
      toggleAdharModal();
      toast.error("Something went wrong, Please try again");

      LoaderHide();
    }
  };

  // pAN vERIFY

  const panVerify = async () => {
    const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panPattern.test(formData.identificationNumber)) {
      toast.error("Invalid PAN number. ");
      return;
    }
    const payload = {
      pan: formData.identificationNumber,
      token: sandboxToken,
    };

    try {
      LoaderShow();
      const response = await postAPI("auth/pan-verify-request", payload);
      if (response.statusCode === 200) {
        LoaderHide();
        setIsVerify(true);
        toast.success(response.message);
      } else {
        LoaderHide();
        toast.error(response.message);
      }
    } catch (error) {
      LoaderHide();
    }
  };

  const handleVerifyBtn = () => {
    if (formData.identityProof == "Pan Card") {
      panVerify();
    } else if (formData.identityProof == "Aadhar Card") {
      handleSendOtp();
    } else {
      toast.error("Select any one Identity Proof");
    }
  };
  // Identification Proof API end
  const Formhandle = (e) => {
    e.preventDefault();
    if (joinee == "Individual") {
      validation.handleSubmit();
    } else {
      companyvalidation.handleSubmit();
    }
  };

  const gstVerify = async () => {
    // const gstPattern =
    //   /^([0-9]){2}([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}([0-9]){1}([a-zA-Z]){1}([0-9]){1}?$/;

    const payload = {
      gstin: companyData.gstNumber,
      token: sandboxToken,
    };

    try {
      if (companyData.gstNumber.length == 15) {
        LoaderShow();
        const response = await postAPI("auth/gst-verify-request", payload);
        if (response.statusCode === 200) {
          setIsGstVerify(true);
          toast.success("GST verified");
          LoaderHide();
        }
      } else {
        toast.error("Invalid GST number. ");
        LoaderHide();
        return;
      }
    } catch (error) {
      LoaderHide();
      toast.error("GST verification failed");
    }
  };

  function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }

  const rows = [
    createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
    createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
    createData("Eclair", 262, 16.0, 24, 6.0),
    createData("Cupcake", 305, 3.7, 67, 4.3),
    createData("Gingerbread", 356, 16.0, 49, 3.9),
  ];

  return (
    <React.Fragment>
      <Card className="registration-card">
        <CardHeader>
          <h4 className="card-title mb-0">Registration</h4>
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
            <ul className="twitter-bs-wizard-nav nav nav-pills nav-justified">
              <NavItem>
                <NavLink
                  href="#"
                  className={classnames({ active: activeTab === 1 })}
                  onClick={() => {
                    // setactiveTab(1);
                    toggleTab(1);
                  }}
                >
                  <div
                    className="step-icon"
                    data-bs-toggle="tooltip"
                    id="ProfileDetails"
                  >
                    <i className="bx bx-list-ul"></i>
                    <UncontrolledTooltip
                      placement="top"
                      target="ProfileDetails"
                    >
                      Profile Details
                    </UncontrolledTooltip>
                  </div>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  href="#"
                  className={classnames({ active: activeTab === 2 })}
                  onClick={() => {
                    // setactiveTab(2);
                    toggleTab(2);
                  }}
                >
                  <div
                    className="step-icon"
                    data-bs-toggle="tooltip"
                    id="ServiceDetails"
                  >
                    <i className="bx bx-book-bookmark"></i>
                    <UncontrolledTooltip
                      placement="top"
                      target="ServiceDetails"
                    >
                      Service Details
                    </UncontrolledTooltip>
                  </div>
                </NavLink>
              </NavItem>

              <NavItem>
                <NavLink
                  href="#"
                  className={classnames({ active: activeTab === 3 })}
                  onClick={() => {
                    // setactiveTab(3);
                    toggleTab(3);
                  }}
                >
                  <div
                    className="step-icon"
                    data-bs-toggle="tooltip"
                    id="BankDetails"
                  >
                    <i className="bx bxs-bank"></i>
                    <UncontrolledTooltip placement="top" target="BankDetails">
                      Bank Details
                    </UncontrolledTooltip>
                  </div>
                </NavLink>
              </NavItem>
            </ul>
            <form onSubmit={Formhandle}>
              <TabContent
                className="twitter-bs-wizard-tab-content"
                activeTab={activeTab}
              >
                {/* {(validation.errors.bankDetails ||
                  validation.errors.formData) && (
                    // companyvalidation.errors.companyData ||
                    // companyvalidation.errors.bankDetails
                    <div
                      style={{
                        textAlign: "center",
                        color: "red",
                        fontSize: "18px",
                        margin: "20px",
                      }}
                    >
                      Please Fill all Details
                    </div>
                  )} */}

                {/* Profile Details */}
                <TabPane tabId={1}>
                  {joinee == "Individual" ? (
                    <div className="text-center mb-4">
                      <h5>Profile Details</h5>
                      <p className="card-title-desc">
                        Fill all information below
                      </p>
                    </div>
                  ) : (
                    <div className="text-center mb-4">
                      <h5>Company Details</h5>
                      <p className="card-title-desc">
                        Fill all information below
                      </p>
                    </div>
                  )}

                  {moreGstChecked ? null : (
                    <>
                      <div
                        className="my-3 "
                        style={{
                          fontWeight: "400",
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "10px",
                        }}
                      >
                        {" "}
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
                            checked={joinee == "Individual"}
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
                            checked={joinee == "Company"}
                            onChange={handleSelectionChange}
                          />
                          Company
                        </label>
                      </div>
                    </>
                  )}

                  {joinee == "Individual" && (
                    <>
                      <div className="row">
                        <div className="col-lg-6">
                          <div className="mb-3">
                            <label className="form-label">Identity Proof</label>
                            <select
                              className="form-select"
                              name="identityProof"
                              onChange={ValueChange}
                              disabled={isVerify}
                              value={formData.identityProof}
                            >
                              <option value="">Select </option>
                              <option value="Aadhar Card">Aadhar Card</option>
                              <option value="Pan Card">PAN Card</option>
                            </select>
                            {validation?.errors?.formData?.identityProof ? (
                              <span style={{ color: "red" }}>
                                {validation?.errors?.formData?.identityProof}
                              </span>
                            ) : null}
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="mb-3">
                            <label
                              htmlFor="basicpill-lastname-input"
                              className="form-label"
                            >
                              Enter Identification Number
                            </label>
                            <input
                              type="text"
                              name="identificationNumber"
                              onChange={ValueChange}
                              value={formData.identificationNumber}
                              className="form-control"
                              id="basicpill-lastname-input"
                              // onBlur={handleBlur}
                              disabled={isVerify}
                            />
                            {verificationStatus.verified && (
                              <FaCheckCircle
                                style={{ color: "green", marginLeft: "10px" }}
                              />
                            )}

                            {verificationStatus.error && (
                              <span style={{ color: "red" }}>
                                {verificationStatus.error}
                              </span>
                            )}
                            {validation?.errors?.formData
                              ?.identificationNumber ? (
                              <span style={{ color: "red" }}>
                                {
                                  validation?.errors?.formData
                                    ?.identificationNumber
                                }
                              </span>
                            ) : null}
                            <div
                              onClick={handleVerifyBtn}
                              disabled={isVerify}
                              style={{ textAlign: "right", cursor: "pointer" }}
                            >
                              {isVerify ? (
                                <span style={{ color: "green" }}>Verified</span>
                              ) : (
                                <span style={{ color: "Blue" }}>Verify</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-lg-6">
                          <div className="mb-3">
                            <label
                              htmlFor="basicpill-firstname-input"
                              className="form-label"
                            >
                              First name
                            </label>
                            <input
                              type="text"
                              name="firstName"
                              onChange={ValueChange}
                              value={formData.firstName}
                              className="form-control"
                              id="basicpill-lastname-input"
                            />
                            {validation?.errors?.formData?.firstName ? (
                              <span style={{ color: "red" }}>
                                {validation?.errors?.formData?.firstName}
                              </span>
                            ) : null}
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="mb-3">
                            <label
                              htmlFor="basicpill-lastname-input"
                              className="form-label"
                            >
                              Last name
                            </label>
                            <input
                              type="text"
                              name="lastName"
                              onChange={ValueChange}
                              value={formData.lastName}
                              className="form-control"
                              id="basicpill-lastname-input"
                            />
                            {validation?.errors?.formData?.lastName ? (
                              <span style={{ color: "red" }}>
                                {validation?.errors?.formData?.lastName}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-lg-6">
                          <div className="mb-3">
                            <label
                              htmlFor="basicpill-phone-input"
                              className="form-label"
                            >
                              Mobile
                            </label>
                            <input
                              type="text"
                              name="phone"
                              readOnly
                              onChange={ValueChange}
                              value={formData.phone}
                              className="form-control"
                              id="basicpill-phone-input"
                            />
                            {validation?.errors?.formData?.phone ? (
                              <span style={{ color: "red" }}>
                                {validation?.errors?.formData?.phone}
                              </span>
                            ) : null}
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <div className="mb-3">
                            <label
                              htmlFor="basicpill-email-input"
                              className="form-label"
                            >
                              Email
                            </label>
                            <input
                              type="email"
                              name="email"
                              onChange={ValueChange}
                              value={formData.email}
                              className="form-control"
                              id="basicpill-email-input"
                            />
                            {validation?.errors?.formData?.email ? (
                              <span style={{ color: "red" }}>
                                {validation?.errors?.formData?.email}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="mb-3">
                            <label
                              htmlFor="basicpill-address-input"
                              className="form-label"
                            >
                              Address
                            </label>
                            <textarea
                              id="basicpill-address-input"
                              className="form-control"
                              rows="2"
                              name="address"
                              onChange={ValueChange}
                              value={formData.address}
                              placeholder="Enter Your Address"
                            ></textarea>
                            {validation?.errors?.formData?.address ? (
                              <span style={{ color: "red" }}>
                                {validation?.errors?.formData?.address}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {joinee == "Company" && (
                    <>
                      {moreGstChecked ? (
                        <>
                          <label
                            style={{
                              fontWeight: "400",
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                            }}
                          >
                            <input
                              type="checkbox"
                              value="morestate"
                              checked={isMoreGstChecked}
                              onChange={MoreGSTCheckboxChange}
                              style={{ marginLeft: "5px" }}
                            />
                            Are you under GST in more that one state ?
                          </label>

                          {/* Multiple GST */}

                          {fields.map((field, index) => (
                            <Row key={index} className="mb-3">
                              <Col md={4}>
                                <Input
                                  type="text"
                                  name="gstNumber"
                                  value={field.gstNumber}
                                  onChange={(event) => handleGST(index, event)}
                                  placeholder="GST Number"
                                />
                              </Col>
                              <Col md={4}>
                                <Input
                                  type="text"
                                  name="state"
                                  value={field.state}
                                  onChange={(event) => handleGST(index, event)}
                                  placeholder="State"
                                />
                              </Col>
                              <Col md={1}>
                                <Button
                                  color="danger"
                                  onClick={() => handleRemoveField(index)}
                                >
                                  <i className="mdi mdi-delete "></i>
                                  {/* mdi-delete */}
                                </Button>
                              </Col>
                              {fields.length - 1 == index ? (
                                <Col md={2}>
                                  <Button
                                    color="primary"
                                    onClick={handleAddField}
                                  >
                                    <i className="mdi  mdi-plus "></i>Add
                                  </Button>
                                </Col>
                              ) : null}
                            </Row>
                          ))}
                        </>
                      ) : (
                        <>
                          <div className="row">
                            <div className="col-lg-6">
                              <div className="mb-3">
                                <label
                                  htmlFor="basicpill-firstname-input"
                                  className="form-label"
                                >
                                  Company Name
                                </label>
                                <input
                                  type="text"
                                  name="companyName"
                                  className="form-control"
                                  id="basicpill-company-input"
                                  onChange={companyValueChange}
                                  value={companyData.companyName}
                                />
                                {companyvalidation.errors.companyData
                                  ?.companyName ? (
                                  <span style={{ color: "red" }}>
                                    {
                                      companyvalidation.errors.companyData
                                        ?.companyName
                                    }
                                  </span>
                                ) : null}
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="mb-3">
                                <label
                                  htmlFor="basicpill-phone-input"
                                  className="form-label"
                                >
                                  Mobile
                                </label>
                                <input
                                  type="text"
                                  name="phone"
                                  readOnly
                                  onChange={companyValueChange}
                                  value={companyData.phone}
                                  className="form-control"
                                  id="basicpill-phone-input"
                                />
                                {companyvalidation.errors.companyData?.phone ? (
                                  <span style={{ color: "red" }}>
                                    {
                                      companyvalidation.errors.companyData
                                        ?.phone
                                    }
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-lg-6">
                              <div className="mb-3">
                                <label
                                  htmlFor="basicpill-email1-input"
                                  className="form-label"
                                >
                                  Email
                                </label>
                                <input
                                  type="email"
                                  name="email"
                                  onChange={companyValueChange}
                                  value={companyData.email}
                                  className="form-control"
                                  id="basicpill-email1-input"
                                />
                                {companyvalidation.errors.companyData?.email &&
                                companyvalidation.errors.companyData?.email ? (
                                  <span style={{ color: "red" }}>
                                    {
                                      companyvalidation.errors.companyData
                                        ?.email
                                    }
                                  </span>
                                ) : null}
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="mb-3">
                                <label
                                  style={{
                                    fontWeight: "400",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "5px",
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    style={{ marginLeft: "5px" }}
                                    checked={isGstCheck}
                                    onChange={GSTCheckboxChange}
                                    disabled={isGstVerify}
                                  />
                                  Do you have GST Number
                                </label>
                                {/* <input
                                  type="text"
                                  className="form-control"
                                  id="basicpill-lastname-input"
                                  name="gstNumber"
                                  onChange={companyValueChange}
                                  value={companyData.gstNumber}
                                  disabled={!isGstCheck}
                                /> */}
                                {/* Conditionally render the input field */}
                                {isGstCheck && (
                                  <div>
                                    <input
                                      type="text"
                                      className="form-control"
                                      id="basicpill-lastname-input"
                                      name="gstNumber"
                                      disabled={isGstVerify}
                                      onChange={companyValueChange}
                                      value={companyData.gstNumber}
                                    />
                                    {companyvalidation.errors.companyData
                                      ?.gstNumber ? (
                                      <span style={{ color: "red" }}>
                                        {
                                          companyvalidation.errors.companyData
                                            ?.gstNumber
                                        }
                                      </span>
                                    ) : null}
                                    <div
                                      onClick={gstVerify}
                                      disabled={isGstVerify}
                                      style={{
                                        textAlign: "right",
                                        cursor: "pointer",
                                      }}
                                    >
                                      {isGstVerify ? (
                                        <span style={{ color: "green" }}>
                                          Verified
                                        </span>
                                      ) : (
                                        <span style={{ color: "Blue" }}>
                                          Verify
                                        </span>
                                      )}
                                    </div>
                                    {/* <button onClick={gstVerify}>Verify</button> */}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-lg-6">
                              <div className="mb-3">
                                <label className="form-label">
                                  Source of Supply
                                </label>
                                <select
                                  className="form-select"
                                  name="sourceSupply"
                                  onChange={companyValueChange}
                                  value={companyData.sourceSupply}
                                >
                                  <option value="">Select </option>
                                  {Statedata.map((item) => {
                                    return (
                                      <option
                                        key={item.value}
                                        value={item.label}
                                      >
                                        {item.label}
                                      </option>
                                    );
                                  })}
                                </select>
                                {companyvalidation.errors.companyData
                                  ?.sourceSupply ? (
                                  <span style={{ color: "red" }}>
                                    {
                                      companyvalidation.errors.companyData
                                        ?.sourceSupply
                                    }
                                  </span>
                                ) : null}
                              </div>
                            </div>
                            <div className="col-lg-6">
                              <div className="mb-3">
                                <label
                                  style={{
                                    fontWeight: "400",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "5px",
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    name="registerMsme"
                                    checked={isMsmeChecked}
                                    onChange={MsmeCheckboxChange}
                                    style={{ marginLeft: "5px" }}
                                  />
                                  Are you registered under MSME
                                </label>

                                {isMsmeChecked && (
                                  <input
                                    type="file"
                                    className="form-control mb-3"
                                    placeholder="Upload Certification"
                                    name="msmefile"
                                    onChange={(event) => {
                                      handleAcceptedFiles(
                                        event,
                                        companyvalidation.setFieldValue
                                      ); // Pass the event and setFieldValue to the handler
                                    }}
                                  />
                                )}

                                <label
                                  style={{
                                    fontWeight: "400",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "5px",
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    value="morestate"
                                    checked={isMoreGstChecked}
                                    onChange={MoreGSTCheckboxChange}
                                    style={{ marginLeft: "5px" }}
                                  />
                                  Are you under GST in more that one state ?
                                </label>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </TabPane>

                {/* Company Details */}
                <TabPane tabId={2}>
                  <div>
                    <div className="text-center mb-4">
                      <h5>Service Details</h5>
                      <p className="card-title-desc">
                        Fill service Coverage information below
                      </p>
                    </div>

                    <div className="row">
                      <div className="col-lg-6">
                        <div className="mb-3">
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

                          {joinee == "Individual" &&
                            (validation?.errors?.selectedStates ? (
                              <span style={{ color: "red" }}>
                                {validation?.errors?.selectedStates}
                              </span>
                            ) : null)}
                          {joinee == "Company" &&
                            (companyvalidation?.errors?.selectedStates ? (
                              <span style={{ color: "red" }}>
                                {companyvalidation?.errors?.selectedStates}
                              </span>
                            ) : null)}
                        </div>
                      </div>

                      {/* <div className="col-lg-6">
                        <div className="mb-3">
                          <label
                            htmlFor="choices-multiple-default"
                            className="form-label font-size-13 text-muted"
                          >
                            City
                          </label>
                          <Select
                            isMulti
                            options={cityOptions} // Dynamically updated city options
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={handleCityChange}
                          />

                          {joinee == "Individual" &&
                            (validation?.errors?.selectedCities ? (
                              <span style={{ color: "red" }}>
                                {validation?.errors?.selectedCities}
                              </span>
                            ) : null)}
                          {joinee == "Company" &&
                            (companyvalidation?.errors?.selectedCities ? (
                              <span style={{ color: "red" }}>
                                {companyvalidation?.errors?.selectedCities}
                              </span>
                            ) : null)}
                        </div>
                      </div> */}

                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label
                            htmlFor="choices-multiple-default"
                            className="form-label font-size-13 text-muted"
                          >
                            City
                          </label>
                          <Select
                            options={cityOptions} // Dynamically updated city options
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
                                      <TableCell align="right">
                                        {row.region}
                                      </TableCell>
                                      <TableCell align="right">
                                        {row.label}
                                      </TableCell>
                                      <TableCell align="right">
                                        {row.latitude}
                                      </TableCell>
                                      <TableCell align="right">
                                        {row.longitude}
                                      </TableCell>
                                      <TableCell align="right">
                                        <span
                                          onClick={() =>
                                            handleSaveLocation(row)
                                          }
                                          disabled={isSaved} // Disable if already saved
                                          style={{
                                            color: isSaved
                                              ? "gray"
                                              : "rgb(39 175 7)",
                                            fontWeight: "600",
                                            cursor: isSaved
                                              ? "not-allowed"
                                              : "pointer",
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

                        {/* <div>
                          {filteredData?.length > 0 && (
                            <div>
                              <h4>Location Results:</h4>
                              <ul>
                                {filteredData?.map((location, index) => (
                                  <li
                                    key={index}
                                    style={{ marginBottom: "10px" }}
                                  >
                                    <strong>Name:</strong> {location.name}{" "}
                                    <br />
                                    <strong>Region:</strong> {location.region}{" "}
                                    <br />
                                    <strong>Label:</strong> {location.label}{" "}
                                    <br />
                                    <strong>latitude:</strong>{" "}
                                    {location.latitude} <br />
                                    <strong>longitude:</strong>{" "}
                                    {location.longitude} <br />
                                    <button
                                      onClick={() =>
                                        handleSaveLocation(location)
                                      }
                                    >
                                      Select
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div> */}
                        <div>
                          {savedLocations.length > 0 && (
                            <div>
                              <h4>Saved Locations:</h4>
                              <ul>
                                {savedLocations.map((location, index) => (
                                  <li key={index}>
                                    {location.name} - {location.region}(
                                    {location.label})
                                    <span
                                      onClick={() =>
                                        handleDeleteLocation(index)
                                      }
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

                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label className="form-label font-size-13 text-muted">
                            Service
                          </label>
                          <Select
                            isMulti
                            options={allService} // Dynamically updated service options
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={handleServiceChange} // Call when services are selected
                          />
                          {joinee == "Individual" &&
                            (validation?.errors?.selectedService ? (
                              <span style={{ color: "red" }}>
                                {validation?.errors?.selectedService}
                              </span>
                            ) : null)}
                          {joinee == "Company" &&
                            (companyvalidation?.errors?.selectedService ? (
                              <span style={{ color: "red" }}>
                                {companyvalidation?.errors?.selectedService}
                              </span>
                            ) : null)}

                          {validation.errors.selectedCities ? (
                            <span style={{ color: "red" }}>
                              {validation.errors.selectedCities}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabPane>

                {/* Bank Details */}
                <TabPane tabId={3}>
                  <div>
                    <div className="text-center mb-4">
                      <h5>Bank Details</h5>
                      <p className="card-title-desc">
                        Fill all information below
                      </p>
                    </div>

                    <div className="row">
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label className="form-label">Bank Name</label>
                          <select
                            className="form-select"
                            name="bankName"
                            onChange={BankValueChange}
                            value={bankDetails.bankName}
                          >
                            <option value="">Select Bank Name</option>
                            {Object.entries(Banks)
                              .sort(([, valueA], [, valueB]) =>
                                valueA.localeCompare(valueB)
                              ) // Sort by bank names (values)
                              .map(([key, value]) => (
                                <option key={key} value={key}>
                                  {value}
                                </option>
                              ))}
                          </select>

                          {joinee == "Company" &&
                            (companyvalidation.errors.bankDetails?.bankName ? (
                              <span style={{ color: "red" }}>
                                {companyvalidation.errors.bankDetails?.bankName}
                              </span>
                            ) : null)}

                          {joinee == "Individual" &&
                            (validation.errors.bankDetails?.bankName ? (
                              <span style={{ color: "red" }}>
                                {validation.errors.bankDetails?.bankName}
                              </span>
                            ) : null)}
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label
                            htmlFor="basicpill-namecard-input"
                            className="form-label"
                          >
                            Account Holder Name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="basicpill-namecard-input"
                            name="accountHolderName"
                            onChange={BankValueChange}
                            value={bankDetails.accountHolderName}
                          />
                          {joinee == "Company" &&
                            (companyvalidation.errors.bankDetails
                              ?.accountHolderName ? (
                              <span style={{ color: "red" }}>
                                {
                                  companyvalidation.errors.bankDetails
                                    ?.accountHolderName
                                }
                              </span>
                            ) : null)}

                          {joinee == "Individual" &&
                            (validation.errors.bankDetails
                              ?.accountHolderName ? (
                              <span style={{ color: "red" }}>
                                {
                                  validation.errors.bankDetails
                                    ?.accountHolderName
                                }
                              </span>
                            ) : null)}
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label
                            htmlFor="basicpill-cardno-input"
                            className="form-label"
                          >
                            Account Number
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="basicpill-cardno-input"
                            name="accountNumber"
                            onChange={BankValueChange}
                            value={bankDetails.accountNumber}
                          />
                          {joinee == "Company" &&
                            (companyvalidation.errors.bankDetails
                              ?.accountNumber ? (
                              <span style={{ color: "red" }}>
                                {
                                  companyvalidation.errors.bankDetails
                                    ?.accountNumber
                                }
                              </span>
                            ) : null)}

                          {joinee == "Individual" &&
                            (validation.errors.bankDetails
                              ?.accountHolderName ? (
                              <span style={{ color: "red" }}>
                                {
                                  validation.errors.bankDetails
                                    ?.accountHolderName
                                }
                              </span>
                            ) : null)}
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label
                            htmlFor="basicpill-card-verification-input"
                            className="form-label"
                          >
                            Confirm Account Number
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="basicpill-card-verification-input"
                            name="cnfmAccountNumber"
                            onChange={BankValueChange}
                            value={bankDetails.cnfmAccountNumber}
                          />
                          {joinee == "Company" &&
                            (companyvalidation.errors.bankDetails
                              ?.cnfmAccountNumber ? (
                              <span style={{ color: "red" }}>
                                {
                                  companyvalidation.errors.bankDetails
                                    ?.cnfmAccountNumber
                                }
                              </span>
                            ) : null)}

                          {joinee == "Individual" &&
                            (validation.errors.bankDetails
                              ?.cnfmAccountNumber ? (
                              <span style={{ color: "red" }}>
                                {
                                  validation.errors.bankDetails
                                    ?.cnfmAccountNumber
                                }
                              </span>
                            ) : null)}
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label
                            htmlFor="basicpill-namecard-input"
                            className="form-label"
                          >
                            IFSC Code
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="basicpill-namecard-input"
                            name="ifscCode"
                            onChange={BankValueChange}
                            value={bankDetails.ifscCode}
                          />
                          {joinee == "Company" &&
                            (companyvalidation.errors.bankDetails?.ifscCode ? (
                              <span style={{ color: "red" }}>
                                {companyvalidation.errors.bankDetails?.ifscCode}
                              </span>
                            ) : null)}

                          {joinee == "Individual" &&
                            (validation.errors.bankDetails?.ifscCode ? (
                              <span style={{ color: "red" }}>
                                {validation.errors.bankDetails?.ifscCode}
                              </span>
                            ) : null)}
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="mb-3">
                          <label className="form-label">Account Type</label>
                          <select
                            className="form-select"
                            name="accountType"
                            onChange={BankValueChange}
                            value={bankDetails.accountType}
                          >
                            <option value="">Select Account Type</option>
                            <option value="savings">Savings</option>
                            <option value="current">Current</option>
                          </select>
                          {joinee == "Company" &&
                            (companyvalidation.errors.bankDetails
                              ?.accountType ? (
                              <span style={{ color: "red" }}>
                                {
                                  companyvalidation.errors.bankDetails
                                    ?.accountType
                                }
                              </span>
                            ) : null)}

                          {joinee == "Individual" &&
                            (validation.errors.bankDetails?.accountType ? (
                              <span style={{ color: "red" }}>
                                {validation.errors.bankDetails?.accountType}
                              </span>
                            ) : null)}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabPane>
              </TabContent>

              {/* Next Previous */}
              <ul className="pager wizard twitter-bs-wizard-pager-link">
                <li
                  className={activeTab === 1 ? "previous disabled" : "previous"}
                >
                  <Link
                    to="#"
                    className={
                      activeTab === 1
                        ? "btn btn-primary disabled"
                        : "btn btn-primary"
                    }
                    onClick={() => {
                      toggleTab(activeTab - 1);
                    }}
                  >
                    <i className="bx bx-chevron-left me-1"></i> Previous
                  </Link>
                </li>

                {activeTab > 2 ? (
                  <li className="next">
                    {/* <Link
                                            to="/login"
                                            className="btn btn-primary"
                                        > */}
                    <button
                      className="btn btn-primary w-100 waves-effect waves-light"
                      type="submit"
                    >
                      save
                    </button>
                    {/* </Link> */}
                  </li>
                ) : (
                  <li className="next">
                    <Link
                      to="#"
                      className="btn btn-primary"
                      onClick={() => toggleTab(activeTab + 1)}
                    >
                      Next <i className="bx bx-chevron-right ms-1"></i>
                    </Link>
                  </li>
                )}
              </ul>
            </form>
          </div>
        </CardBody>
      </Card>

      <Modal isOpen={adharModal} toggle={toggleAdharModal}>
        <ModalHeader toggle={toggleAdharModal}>Verify OTP</ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-lg-6">
              <div className="mb-3">
                <label
                  htmlFor="basicpill-lastname-input"
                  className="form-label"
                >
                  Enter OTP{" "}
                </label>
                <input
                  type="text"
                  name="otp"
                  className="form-control"
                  id="otp"
                />
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleAdharModal}>
            Cancel
          </Button>{" "}
          <Button color="success" onClick={handleVerifyOtp}>
            Verify
          </Button>{" "}
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default UserDetails;
