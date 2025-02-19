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
  Button,
  FormGroup,
  Modal,
  Input,
  Row,
  Col,

  Label,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { errorStyle } from "../../../helpers/common_constants";
import { handleFileUpload } from "../../../common/utility";
import Dropzone from "react-dropzone";
import Select from "react-select";
import { Banks } from "../../../constants/ObjectData";
import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  TextField,
} from "@mui/material";
import axios from "axios";
import { postAPI } from "../../../Services/Apis";

const ClassARegister = () => {
  const getPhoneNumber = JSON.parse(localStorage?.getItem("registerNumber"));
  const getpassword = JSON.parse(localStorage?.getItem("registerPassword"));

  const [activeTab, setactiveTab] = useState(1);
  const [panCardUpload, setPanCardUpload] = useState([]);
  const [aadharCardUpload, setAadharCardUpload] = useState([]);
  const [gstNumberUpload, setGSTNumberUpload] = useState([]);
  const [licenceCopyUpload, setLicenceCopyUpload] = useState([]);
  const [moaUpload, setMoaUpload] = useState([]);
  const [signatoryDirectorListUpload, setSignatoryDirectorListUpload] =
    useState([]);
  const [cancelChequeUpload, setCancelChequeUpload] = useState([]);

  const BlackHaulOptions = [
    { label: "Airtel", value: "airtel" },
    { label: "Tata", value: "tata" },
    { label: "Jio ", value: "jio" },
    { label: "Vodafone", value: "vodafone" },
    { label: "Sifty", value: "sify" },
    { label: "Hathway", value: "hathway" },
  ];

  const mediaOptions = [
    { label: "Fiber", value: "fiber" },
    { label: "RF", value: "rf" },
    { label: "Copper ", value: "copper" },
  ];

  const servicesDropdown = [
    { label: "Broadband", value: "broadband" },
    { label: "Broadband Commercial", value: "broadbandCommercial" },
    { label: "ILL (Internet Lease Line)", value: "ILL" },
    { label: "P2P (Point to Point)", value: "P2P" },
    { label: "MPLS", value: "MPLS" },
  ];

  const paymentModeDropdown = [
    { label: "NEFT", value: "neft" },
    { label: "Cheque", value: "cheque" },
    { label: "Payment Link", value: "paymentLink" },
  ];

  const deliveryTimeLineOptions = [
    { value: "oneweek", label: "One Week" },
    { value: "twoweek", label: "Two Week" },
    { value: "threeweek", label: "Three Week" },
    { value: "fourweek", label: "Four Week" },
    { value: "fiveweek", label: "Five Week" },
    { value: "sixweek", label: "Six Week" },
    { value: "sevenweek", label: "Seven Week" },
    { value: "eightweek", label: "Eight Week" },
    { value: "nineweek", label: "Nine Week" },
    { value: "tenweek", label: "Ten Week" },
  ];

  const bankAccount = [
    { value: "savings", label: "Savings" },
    { value: "current", label: "Current" },
    { value: "salary", label: "Salary" },
    { value: "demat", label: "Demat" },
  ];

  const validationSchemas = {
    1: Yup.object().shape({
      companyName: Yup.string().required("Company Name is required"),
      companyWebsite: Yup.string().required("Company Website is required"),
      ownerName: Yup.string().required("Owner Name is required"),
      designation: Yup.string().required("Designation is required"),
      email: Yup.string()
        .matches(
          /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
          "Enter a valid email address"
        )
        .required("Email is required"),
      moaUpload: Yup.array().min(1, "Upload at least one MOA copy").required(),
      signatoryDirectorListUpload: Yup.array()
        .min(1, "Upload at least one signatory director list copy")
        .required(),
    }),
    2: Yup.object().shape({
      licenceNumber: Yup.string().required("Licence number is required"),
      licenceRenewalDate: Yup.string().required(
        "Licence renewal date number is required"
      ),
      licenceCopyUpload: Yup.array()
        .min(1, "Upload at least one licence copy")
        .required(),
      panCardUpload: Yup.array()
        .min(1, "Upload at least one pan card copy")
        .required(),
      aadharCardUpload: Yup.array()
        .min(1, "Upload at least one aadhar card copy")
        .required(),
      gstNumberUpload: Yup.array()
        .min(1, "Upload at least one gst number copy")
        .required(),
      cancelChequeUpload: Yup.array()
        .min(1, "Upload at least one cancel cheque copy")
        .required(),
      deliveryTimeLine: Yup.string().required("Delivery time line is required"),
      availableBlackHaul: Yup.array()
        .of(
          Yup.object().shape({
            label: Yup.string().required("Black haul label is required"),
            value: Yup.string().required("Black haul value is required"),
          })
        )
        .min(1, "Please select at least one black haul"),
      media: Yup.array()
        .of(
          Yup.object().shape({
            label: Yup.string().required("media label is required"),
            value: Yup.string().required("media value is required"),
          })
        )
        .min(1, "Please select at least one media"),
      services: Yup.array()
        .of(
          Yup.object().shape({
            label: Yup.string().required("services label is required"),
            value: Yup.string().required("services value is required"),
          })
        )
        .min(1, "Please select at least service"),
      contractPeriod: Yup.string().required("Contract period is required"),
      paymentMode: Yup.array()
        .of(
          Yup.object().shape({
            label: Yup.string().required("payment label is required"),
            value: Yup.string().required("payment value is required"),
          })
        )
        .min(1, "Please select one payment method"),
    }),
    3: Yup.object().shape({
      bandwidth: Yup.array()
        .of(
          Yup.object().shape({
            otc: Yup.string().nullable().notRequired(),
            billOption: Yup.string().nullable().notRequired(),
            billOptionPrice: Yup.string().nullable().notRequired(),
            totalPrice: Yup.string().nullable().notRequired(),
          })
        )
        .test(
          "at-least-one-plan",
          "At least one plan must be filled out",
          (values) => {
            return values.some((plan) => {
              return (
                (plan.otc && plan.otc.trim() !== "") ||
                (plan.billOption && plan.billOption.trim() !== "") ||
                (plan.billOptionPrice && plan.billOptionPrice.trim() !== "")
              );
            });
          }
        ),
    }),
    4: Yup.object().shape({
      unlimitedbandwidth: Yup.array()
        .of(
          Yup.object().shape({
            otc: Yup.string().nullable().notRequired(),
            billOption: Yup.string().nullable().notRequired(),
            billOptionPrice: Yup.string().nullable().notRequired(),
            totalPrice: Yup.string().nullable().notRequired(),
          })
        )
        .test(
          "at-least-one-plan",
          "At least one plan must be filled out",
          (values) => {
            return values.some((plan) => {
              return (
                (plan.otc && plan.otc.trim() !== "") ||
                (plan.billOption && plan.billOption.trim() !== "") ||
                (plan.billOptionPrice && plan.billOptionPrice.trim() !== "")
              );
            });
          }
        ),
    }),
    5: Yup.object().shape({
      unlimitedbandwidth: Yup.array()
        .of(
          Yup.object().shape({
            otc: Yup.string().nullable().notRequired(),
            billOption: Yup.string().nullable().notRequired(),
            billOptionPrice: Yup.string().nullable().notRequired(),
            totalPrice: Yup.string().nullable().notRequired(),
          })
        )
        .test(
          "at-least-one-plan",
          "At least one plan must be filled out",
          (values) => {
            return values.some((plan) => {
              return (
                (plan.otc && plan.otc.trim() !== "") ||
                (plan.billOption && plan.billOption.trim() !== "") ||
                (plan.billOptionPrice && plan.billOptionPrice.trim() !== "")
              );
            });
          }
        ),
    }),
    6: Yup.object({
      bankDetails: Yup.object().shape({
        bankName: Yup.string().required("Bank name is required"),
        accountHolderName: Yup.string().required(
          "Account holder name is required"
        ),
        ifscCode: Yup.string()
          .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code")
          .required("IFSC code is required"),
        branchName: Yup.string().required("Branch name is required"),
        accountNumber: Yup.string()
          .matches(/^\d+$/, "Account Number must contain only digits") // Ensure numeric input
          .min(8, "Account Number must be at least 8 digits")
          .max(16, "Account Number cannot exceed 16 digits")
          .required("Account Number is required"),
        cnfmAccountNumber: Yup.string()
          .required("Confirm Account Number is required")
          .oneOf(
            [Yup.ref("accountNumber"), null],
            "Confirm Account Number must match Account Number"
          ),
        accountType: Yup.string().required("Account type is required"),
      }),
    }),
    7: Yup.object().shape({
      permanentAddress: Yup.object().shape({
        pinCode: Yup.string()
          .required("Pin Code is required")
          .matches(
            /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/,
            "Enter a valid pincode"
          ),
        street: Yup.string().required("Street is required"),
        city: Yup.string().required("City is required"),
        state: Yup.string().required("State is required"),
        country: Yup.string().required("Country is required"),
      }),
      officeAddress: Yup.object().shape({
        pinCode: Yup.string()
          .required("Pin Code is required")
          .matches(
            /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/,
            "Enter a valid pincode"
          ),
        street: Yup.string().required("Street is required"),
        city: Yup.string().required("City is required"),
        state: Yup.string().required("State is required"),
        country: Yup.string().required("Country is required"),
      }),
    }),
  };

  const validateTab = async (tab) => {
    const schema = validationSchemas[tab];
    if (schema) {
      try {
        await schema.validate(classAValidation.values, { abortEarly: false });
        // Custom validation for pincode
        if (tab === 5) {
          if (savedDetails.length === 0) {
            classAValidation.setFieldError(
              "serviceCoverage",
              "Please enter at least one coverage area."
            );
            return false;
          } else {
            // Clear the error if a pincode is entered
            classAValidation.setFieldError("serviceCoverage", null);
          }
        }

        return true;
      } catch (error) {
        error?.inner?.forEach((err) => {
          classAValidation?.setFieldError(err.path, err.message);
        });
        return false;
      }
    }
    return true;
  };
  const toggleTab = async (tab) => {
    if (tab < 1 || tab > 8) return;
    if (tab > activeTab) {
      const isValid = await validateTab(activeTab);
      if (!isValid) return;
    }
    setactiveTab(tab);
  };

  const handleAvailableBlackHaul = (selectedOptions, setFieldValue) => {
    const selectedValues = selectedOptions
      ? selectedOptions.map((option) => ({
          value: option.value,
          label: option.label,
        }))
      : [];
    setFieldValue("availableBlackHaul", selectedValues);
  };

  const handleMedia = (selectedOptions, setFieldValue) => {
    const selectedValues = selectedOptions
      ? selectedOptions.map((option) => ({
          value: option.value,
          label: option.label,
        }))
      : [];
    setFieldValue("media", selectedValues);
  };

  const handleServices = (selectedOptions, setFieldValue) => {
    const selectedValues = selectedOptions
      ? selectedOptions.map((option) => ({
          value: option.value,
          label: option.label,
        }))
      : [];
    setFieldValue("services", selectedValues);
  };

  const handlePaymentMode = (selectedOptions, setFieldValue) => {
    const selectedValues = selectedOptions
      ? selectedOptions.map((option) => ({
          value: option.value,
          label: option.label,
        }))
      : [];
    setFieldValue("paymentMode", selectedValues);
  };

  const handleDeliveryTimeLine = (selectedOption, setFieldValue) => {
    setFieldValue(
      "deliveryTimeLine",
      selectedOption ? selectedOption.value : null
    );
  };

  const options = [
    { value: "10MBPS", label: "10MBPS" },
    { value: "20MBPS", label: "20MBPS" },
    { value: "30MBPS", label: "30MBPS" },
    { value: "40MBPS", label: "40MBPS" },
    { value: "50MBPS", label: "50MBPS" },
    { value: "100MBPS", label: "100MBPS" },
    { value: "200MBPS", label: "200MBPS" },
    { value: "500MBPS", label: "500MBPS" },
    { value: "1GBPS", label: "1GBPS" },
  ];

  const billOptions = [
    { value: "MRC", label: "Monthly Recurring Cost (MRC)" },
    { value: "QRC", label: "Quarterly Recurring Cost (QRC)" },
    { value: "HRC", label: "Half Recurring Cost (HRC)" },
    { value: "ARC", label: "Annual Recurring Cost (ARC)" },
  ];

  const handleInputChange = (e, index, field) => {
    const updatedValues = [...classAValidation.values.bandwidth];

    // Ensure the entry exists
    if (!updatedValues[index]) {
      updatedValues[index] = {
        bandwidthPlan: options[index].value,
        otc: "",
        billOption: "",
        billOptionPrice: "",
        totalPrice: 0,
      };
    }

    updatedValues[index][field] = e.target.value;

    // Recalculate total price
    const otc = parseFloat(updatedValues[index].otc || 0);
    const billOptionPrice = parseFloat(
      updatedValues[index].billOptionPrice || 0
    );
    updatedValues[index].totalPrice = otc + billOptionPrice * 1.18;

    classAValidation.setFieldValue("bandwidth", updatedValues);
  };

  const handleSelectChange = (selectedOption, index) => {
    const updatedValues = [...classAValidation.values.bandwidth];

    // Ensure the entry exists
    if (!updatedValues[index]) {
      updatedValues[index] = {
        bandwidthPlan: options[index].value,
        otc: "",
        billOption: "",
        billOptionPrice: "",
        totalPrice: 0,
      };
    }

    // Update only the selected fields
    updatedValues[index].billOption = selectedOption.value;

    // Recalculate total price
    const otc = parseFloat(updatedValues[index].otc || 0);
    const billOptionPrice = parseFloat(
      updatedValues[index].billOptionPrice || 0
    );
    updatedValues[index].totalPrice = (otc + billOptionPrice * 1.18).toString(); // Save as string

    classAValidation.setFieldValue("bandwidth", updatedValues);
  };

  const handleInputChangeUnlimitedBandwidth = (e, index, field) => {
    const updatedValues = [...classAValidation.values.unlimitedbandwidth];

    // Ensure the entry exists
    if (!updatedValues[index]) {
      updatedValues[index] = {
        bandwidthPlan: options[index].value,
        otc: "",
        billOption: "",
        billOptionPrice: "",
        totalPrice: 0,
      };
    }

    updatedValues[index][field] = e.target.value;

    // Recalculate total price
    const otc = parseFloat(updatedValues[index].otc || 0);
    const billOptionPrice = parseFloat(
      updatedValues[index].billOptionPrice || 0
    );
    updatedValues[index].totalPrice = otc + billOptionPrice * 1.18;

    classAValidation.setFieldValue("unlimitedbandwidth", updatedValues);
  };

  const handleSelectChangeUnlimitedBandwidth = (selectedOption, index) => {
    const updatedValues = [...classAValidation.values.unlimitedbandwidth];

    // Ensure the entry exists
    if (!updatedValues[index]) {
      updatedValues[index] = {
        bandwidthPlan: options[index].value,
        otc: "",
        billOption: "",
        billOptionPrice: "",
        totalPrice: 0,
      };
    }

    // Update only the selected fields
    updatedValues[index].billOption = selectedOption.value;

    // Recalculate total price
    const otc = parseFloat(updatedValues[index].otc || 0);
    const billOptionPrice = parseFloat(
      updatedValues[index].billOptionPrice || 0
    );
    updatedValues[index].totalPrice = (otc + billOptionPrice * 1.18).toString(); // Save as string

    classAValidation.setFieldValue("unlimitedbandwidth", updatedValues);
  };

  const [locationData, setLocationData] = useState([]);
  const [pincode, setPincode] = useState("");
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [savedDetails, setSavedDetails] = useState([]);
  const [errors, setErrors] = useState({});

  const validatePincode = (enteredPincode) => {
    if (!enteredPincode) {
      return "Pincode is required.";
    }
    if (!/^\d{6}$/.test(enteredPincode)) {
      return "Pincode must be a valid 6-digit number.";
    }
    return "";
  };

  const handlePincodeChange = async (event) => {
    const enteredPincode = event.target.value;
    setPincode(enteredPincode);

    const validationError = validatePincode(enteredPincode);
    if (validationError) {
      setErrors((prevErrors) => ({ ...prevErrors, pincode: validationError }));
      setLocationData([]);
      return;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, pincode: "" }));
    }

    if (enteredPincode.length === 6) {
      try {
        const response = await axios.get(
          `https://api.postalpincode.in/pincode/${enteredPincode}`
        );
        const data = response.data[0]?.PostOffice;

        if (data) {
          const location = data.map((item) => ({
            value: item.Name,
            label: `${item.Name}, ${item.District}, ${item.State}`,
            district: item.District,
            state: item.State,
          }));

          setLocationData(location);
        } else {
          setLocationData([]);
          setErrors((prevErrors) => ({
            ...prevErrors,
            pincode: "No locations found for the entered pincode.",
          }));
        }
      } catch (error) {
        console.error("Error fetching location data:", error);
        setErrors((prevErrors) => ({
          ...prevErrors,
          pincode: "Failed to fetch locations. Please try again.",
        }));
      }
    }
  };

  const handleLocationChange = (selectedOptions) => {
    setSelectedLocations(selectedOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const pincodeError = validatePincode(pincode);
    if (pincodeError || selectedLocations.length === 0) {
      setErrors({
        pincode: pincodeError || "Please enter a valid pincode.",
        serviceCoverage:
          selectedLocations.length === 0
            ? "Please select at least one location."
            : "",
      });
      return;
    }

    // Save details
    const newDetail = {
      pincode,
      locations: selectedLocations,
    };
    setSavedDetails((prevDetails) => [...prevDetails, newDetail]);

    // Clear fields
    setPincode("");
    setSelectedLocations([]);
    setLocationData([]);
    setErrors({});
  };

  const classAValidation = useFormik({
    initialValues: {
      user: "isp",
      role: "isp",
      password: getpassword.password,
      phone: getPhoneNumber.phone,
      bandwidth: options.map((option) => ({
        bandwidthPlan: option.value, // Initialize with the option's label
        otc: "",
        billOption: "",
        billOptionPrice: "",
        totalPrice: 0,
      })),
      unlimitedbandwidth: options.map((option) => ({
        bandwidthPlan: option.value, // Initialize with the option's label
        otc: "",
        billOption: "",
        billOptionPrice: "",
        totalPrice: 0,
      })),
      status: "active",
      companyName: "",
      companyWebsite: "",
      serviceCoverage: [],
      escalationMatrix: [
        { name: "", contactOne: "", email: "", designation: "" },
        { name: "", contactOne: "", email: "", designation: "" },
        { name: "", contactOne: "", email: "", designation: "" },
      ],
      ownerName: "",
      designation: "",
      email: "",
      moaUpload: [],
      signatoryDirectorListUpload: [],
      panCardUpload: [],
      aadharCardUpload: [],
      gstNumberUpload: [],
      licenceCopyUpload: [],
      licenceNumber: "",
      licenceRenewalDate: "",
      cancelChequeUpload: [],
      availableBlackHaul: [],
      media: [],
      services: [],
      contractPeriod: "",
      paymentMode: [],
      deliveryTimeLine: "",
      permanentAddress: {
        pinCode: "",
        street: "",
        city: "",
        state: "",
        country: "",
      },
      officeAddress: {
        pinCode: "",
        street: "",
        city: "",
        state: "",
        country: "",
      },
      copyAddress: false, // For the checkbox
      bankDetails: {
        bankName: "",
        accountHolderName: "",
        accountNumber: "",
        cnfmAccountNumber: "",
        ifscCode: "",
        branchName: "",
        accountType: "",
      },
    },
    validationSchema: Yup.object().shape({
      escalationMatrix: Yup.array().of(
        Yup.object({
          name: Yup.string().required("Name is required"),
          contactOne: Yup.string().required("Contact One is required"),
          email: Yup.string()
            .email("Invalid email format")
            .required("Email is required"),
          designation: Yup.string().required("Designation is required"),
        })
      ),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        await submitFormToAPI(values);
      } catch (error) {
        LoaderHide();
        toast.error(error.message);
      }
    },
  });

  const submitFormToAPI = async (event) => {
    event.preventDefault();

    try {
      const isValid = await validateTab(activeTab);
      const hasNoErrors = Object.keys(classAValidation.errors || {});
  
      if (isValid && hasNoErrors) {
  
        const {
          user,
          role,
          companyName,
          companyWebsite,
          contractPeriod,
          deliveryTimeLine,
          designation,
          email,
          licenceNumber,
          licenceRenewalDate,
          ownerName,
          password,
          phone,
          status,
          escalationMatrix,
          bandwidth,
          unlimitedbandwidth,
          bankDetails,
          permanentAddress,
          officeAddress,
          availableBlackHaul,
          media,
          paymentMode,
          services,
        } = classAValidation.values;
  
        const formData = new FormData();
  
        formData.append("user", user);
        formData.append("role", role);
        formData.append("status", status);
        formData.append("companyName", companyName);
        formData.append("companyWebsite", companyWebsite);
        formData.append("contractPeriod", contractPeriod);
        formData.append("deliveryTimeLine", deliveryTimeLine);
        formData.append("designation", designation);
        formData.append("email", email);
        formData.append("licenceNumber", licenceNumber);
        formData.append("licenceRenewalDate", licenceRenewalDate);
        formData.append("ownerName", ownerName);
        formData.append("password", password);
        formData.append("phone", phone);
  
        formData.append("escalationMatrix", JSON.stringify(escalationMatrix));
        formData.append("bandwidth", JSON.stringify(bandwidth));
        formData.append("unlimitedbandwidth", JSON.stringify(unlimitedbandwidth));
        formData.append("bankDetails", JSON.stringify(bankDetails));
        formData.append("permanentAddress", JSON.stringify(permanentAddress));
        formData.append("officeAddress", JSON.stringify(officeAddress));
        formData.append("availableBlackHaul", JSON.stringify(availableBlackHaul));
        formData.append("media", JSON.stringify(media));
        formData.append("paymentMode", JSON.stringify(paymentMode));
        formData.append("services", JSON.stringify(services));
        formData.append("serviceCoverage", JSON.stringify(savedDetails));
  
        if (classAValidation.values.aadharCardUpload.length > 0) {
          formData.append(
            "aadharCardUpload",
            classAValidation.values.aadharCardUpload[0]
          );
        }
        if (classAValidation.values.cancelChequeUpload.length > 0) {
          formData.append(
            "cancelChequeUpload",
            classAValidation.values.cancelChequeUpload[0]
          );
        }
        if (classAValidation.values.gstNumberUpload.length > 0) {
          formData.append(
            "gstNumberUpload",
            classAValidation.values.gstNumberUpload[0]
          );
        }
        if (classAValidation.values.licenceCopyUpload.length > 0) {
          formData.append(
            "licenceCopyUpload",
            classAValidation.values.licenceCopyUpload[0]
          );
        }
        if (classAValidation.values.moaUpload.length > 0) {
          formData.append("moaUpload", classAValidation.values.moaUpload[0]);
        }
        if (classAValidation.values.panCardUpload.length > 0) {
          formData.append(
            "panCardUpload",
            classAValidation.values.panCardUpload[0]
          );
        }
        if (classAValidation.values.signatoryDirectorListUpload.length > 0) {
          formData.append(
            "signatoryDirectorListUpload",
            classAValidation.values.signatoryDirectorListUpload[0]
          );
        }

        console.log("classs=========",classAValidation.values)
  
        const response = await postAPI("isp/register-isp", formData);
  
        // console.log("response=====", response);
      } else {
        console.log("===Form validation failed");
      }
    } catch (error) {
      if (error.response) {
        // Backend responded with an error
        console.error("Response Error:", error.response.data);
      } else if (error.request) {
        // No response received from backend
        console.error("Request Error:", error.request);
      } else {
        // Something else went wrong
        console.error("Error:", error.message);
      }
    }

   
  };

  return (
    <React.Fragment>
      <form>
        <TabContent
          className="twitter-bs-wizard-tab-content"
          activeTab={activeTab}
        >
          <TabPane tabId={1}>
            <div className="row">
              <div className="col-lg-6">
                <div className="mb-3">
                  <label
                    htmlFor="basicpill-companyName-input"
                    className="form-label"
                  >
                    Company Name
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    name="companyName"
                    onChange={classAValidation.handleChange}
                    onBlur={classAValidation.handleChange}
                    value={classAValidation.values.companyName}
                    className="form-control"
                    placeholder="Enter Your Company Name"
                  />
                  {classAValidation.errors.companyName ? (
                    <span style={errorStyle}>
                      {classAValidation.errors.companyName}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="col-lg-6">
                <div className="mb-3">
                  <label
                    htmlFor="basicpill-companyWebsite-input"
                    className="form-label"
                  >
                    Company Website
                  </label>
                  <input
                    id="companyWebsite"
                    type="text"
                    name="companyWebsite"
                    onChange={classAValidation.handleChange}
                    onBlur={classAValidation.handleChange}
                    value={classAValidation.values.companyWebsite}
                    className="form-control"
                    placeholder="Enter Your Company Website"
                  />
                  {classAValidation.errors.companyWebsite ? (
                    <span style={errorStyle}>
                      {classAValidation.errors.companyWebsite}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <div className="mb-3">
                  <label
                    htmlFor="basicpill-ownerName-input"
                    className="form-label"
                  >
                    Owner Name
                  </label>
                  <input
                    id="ownerName"
                    type="text"
                    name="ownerName"
                    onChange={classAValidation.handleChange}
                    onBlur={classAValidation.handleChange}
                    value={classAValidation.values.ownerName}
                    className="form-control"
                    placeholder="Enter Your Owner Name"
                  />
                  {classAValidation.errors.ownerName ? (
                    <span style={errorStyle}>
                      {classAValidation.errors.ownerName}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="col-lg-6">
                <div className="mb-3">
                  <label htmlFor="basicpill-email-input" className="form-label">
                    Email
                  </label>
                  <input
                    id="email"
                    type="text"
                    name="email"
                    onChange={classAValidation.handleChange}
                    onBlur={classAValidation.handleChange}
                    value={classAValidation.values.email}
                    className="form-control"
                    placeholder="Enter Your email"
                  />
                  {classAValidation.errors.email ? (
                    <span style={errorStyle}>
                      {classAValidation.errors.email}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <div className="mb-3">
                  <label
                    htmlFor="basicpill-designation-input"
                    className="form-label"
                  >
                    Designation
                  </label>
                  <input
                    id="designation"
                    type="text"
                    name="designation"
                    onChange={classAValidation.handleChange}
                    onBlur={classAValidation.handleChange}
                    value={classAValidation.values.designation}
                    className="form-control"
                    placeholder="Enter Your Designation"
                  />
                  {classAValidation.errors.designation ? (
                    <span style={errorStyle}>
                      {classAValidation.errors.designation}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="col-lg-6">
                <div className="mb-3">
                  <label htmlFor="basicpill-phone-input" className="form-label">
                    Mobile Number
                  </label>
                  <input
                    readOnly
                    id="phone"
                    type="text"
                    name="phone"
                    onChange={classAValidation.handleChange}
                    onBlur={classAValidation.handleChange}
                    value={classAValidation.values.phone}
                    className="form-control"
                    placeholder="Enter Your Mobile Number"
                  />
                  {classAValidation.errors.phone ? (
                    <span style={errorStyle}>
                      {classAValidation.errors.phone}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <div className="mb-3">
                  <div className="mb-3">
                    <Label className="form-label">
                      MOA (Memorandum of Association)
                    </Label>
                    <Dropzone
                      onDrop={(acceptedFiles) =>
                        handleFileUpload(
                          acceptedFiles,
                          classAValidation.setFieldValue,
                          setMoaUpload, // Set the state for panCard
                          "moaUpload" // Field name dynamically passed
                        )
                      }
                    >
                      {({ getRootProps, getInputProps }) => (
                        <div className="dropzone">
                          <div
                            className="dz-message needsclick mt-2"
                            {...getRootProps()}
                          >
                            <input {...getInputProps()} />
                            <i className="display-4 text-muted bx bx-cloud-upload" />
                          </div>
                        </div>
                      )}
                    </Dropzone>
                    <div className="dropzone-previews mt-3" id="file-previews">
                      {moaUpload.map((file, i) => (
                        <Card
                          className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                          key={i + "-file"}
                        >
                          <div className="p-2">
                            <Row className="align-items-center">
                              <Col className="col-auto">
                                {file.type.startsWith("image/") ? (
                                  <>
                                    <img
                                      src={file.preview}
                                      height="70"
                                      width="70"
                                      style={{ marginTop: "15px" }}
                                      alt={file.name}
                                    />
                                    <p
                                      style={{
                                        color: "rgb(245 146 34)",
                                        marginTop: "5px",
                                      }}
                                    >
                                      {file.name}
                                    </p>
                                  </>
                                ) : file.type === "application/pdf" ? (
                                  <a
                                    href={file.preview}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <i className="far fa-file-pdf fa-2x text-danger"></i>
                                    <p>{file.name}</p>
                                  </a>
                                ) : (
                                  <p>Unsupported file type</p>
                                )}
                              </Col>
                            </Row>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                  {classAValidation?.errors?.moaUpload ? (
                    <span style={{ color: "red" }}>
                      {classAValidation?.errors?.moaUpload}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="col-lg-6">
                <div className="mb-3">
                  <div className="mb-3">
                    <Label className="form-label">
                      Signatory Director Document
                    </Label>
                    <Dropzone
                      onDrop={(acceptedFiles) =>
                        handleFileUpload(
                          acceptedFiles,
                          classAValidation.setFieldValue,
                          setSignatoryDirectorListUpload, // Set the state for panCard
                          "signatoryDirectorListUpload" // Field name dynamically passed
                        )
                      }
                    >
                      {({ getRootProps, getInputProps }) => (
                        <div className="dropzone">
                          <div
                            className="dz-message needsclick mt-2"
                            {...getRootProps()}
                          >
                            <input {...getInputProps()} />
                            <i className="display-4 text-muted bx bx-cloud-upload" />
                          </div>
                        </div>
                      )}
                    </Dropzone>
                    <div className="dropzone-previews mt-3" id="file-previews">
                      {signatoryDirectorListUpload.map((file, i) => (
                        <Card
                          className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                          key={i + "-file"}
                        >
                          <div className="p-2">
                            <Row className="align-items-center">
                              <Col className="col-auto">
                                {file.type.startsWith("image/") ? (
                                  <>
                                    <img
                                      src={file.preview}
                                      height="70"
                                      width="70"
                                      style={{ marginTop: "15px" }}
                                      alt={file.name}
                                    />
                                    <p
                                      style={{
                                        color: "rgb(245 146 34)",
                                        marginTop: "5px",
                                      }}
                                    >
                                      {file.name}
                                    </p>
                                  </>
                                ) : file.type === "application/pdf" ? (
                                  <a
                                    href={file.preview}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <i className="far fa-file-pdf fa-2x text-danger"></i>
                                    <p>{file.name}</p>
                                  </a>
                                ) : (
                                  <p>Unsupported file type</p>
                                )}
                              </Col>
                            </Row>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                  {classAValidation?.errors?.signatoryDirectorListUpload ? (
                    <span style={{ color: "red" }}>
                      {classAValidation?.errors?.signatoryDirectorListUpload}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </TabPane>

          <TabPane tabId={2}>
            <div className="row">
              <div className="col-lg-6">
                <div className="mb-3">
                  <label
                    htmlFor="basicpill-licenceNumber-input"
                    className="form-label"
                  >
                    Licence Number
                  </label>
                  <input
                    id="licenceNumber"
                    type="text"
                    name="licenceNumber"
                    onChange={classAValidation.handleChange}
                    onBlur={classAValidation.handleChange}
                    value={classAValidation.values.licenceNumber}
                    className="form-control"
                    placeholder="Enter Your Licence Number"
                  />
                  {classAValidation.errors.licenceNumber ? (
                    <span style={errorStyle}>
                      {classAValidation.errors.licenceNumber}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="col-lg-6">
                <div className="mb-3">
                  <label
                    htmlFor="basicpill-licenceRenewalDate-input"
                    className="form-label"
                  >
                    Licence Renewal Date
                  </label>
                  <input
                    id="licenceRenewalDate"
                    type="text"
                    name="licenceRenewalDate"
                    onChange={classAValidation.handleChange}
                    onBlur={classAValidation.handleChange}
                    value={classAValidation.values.licenceRenewalDate}
                    className="form-control"
                    placeholder="Enter Your Licence Renewal Date"
                  />
                  {classAValidation.errors.licenceRenewalDate ? (
                    <span style={errorStyle}>
                      {classAValidation.errors.licenceRenewalDate}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <div className="mb-3">
                  <div className="mb-3">
                    <Label className="form-label">Licence Copy</Label>
                    <Dropzone
                      onDrop={(acceptedFiles) =>
                        handleFileUpload(
                          acceptedFiles,
                          classAValidation.setFieldValue,
                          setLicenceCopyUpload, // Set the state for panCard
                          "licenceCopyUpload" // Field name dynamically passed
                        )
                      }
                    >
                      {({ getRootProps, getInputProps }) => (
                        <div className="dropzone">
                          <div
                            className="dz-message needsclick mt-2"
                            {...getRootProps()}
                          >
                            <input {...getInputProps()} />
                            <i className="display-4 text-muted bx bx-cloud-upload" />
                          </div>
                        </div>
                      )}
                    </Dropzone>
                    <div className="dropzone-previews mt-3" id="file-previews">
                      {licenceCopyUpload.map((file, i) => (
                        <Card
                          className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                          key={i + "-file"}
                        >
                          <div className="p-2">
                            <Row className="align-items-center">
                              <Col className="col-auto">
                                {file.type.startsWith("image/") ? (
                                  <>
                                    <img
                                      src={file.preview}
                                      height="70"
                                      width="70"
                                      style={{ marginTop: "15px" }}
                                      alt={file.name}
                                    />
                                    <p
                                      style={{
                                        color: "rgb(245 146 34)",
                                        marginTop: "5px",
                                      }}
                                    >
                                      {file.name}
                                    </p>
                                  </>
                                ) : file.type === "application/pdf" ? (
                                  <a
                                    href={file.preview}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <i className="far fa-file-pdf fa-2x text-danger"></i>
                                    <p>{file.name}</p>
                                  </a>
                                ) : (
                                  <p>Unsupported file type</p>
                                )}
                              </Col>
                            </Row>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                  {classAValidation?.errors?.licenceCopyUpload ? (
                    <span style={{ color: "red" }}>
                      {classAValidation?.errors?.licenceCopyUpload}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="col-lg-6">
                <div className="mb-3">
                  <div className="mb-3">
                    <Label className="form-label">Upload Pan Card</Label>
                    <Dropzone
                      onDrop={(acceptedFiles) =>
                        handleFileUpload(
                          acceptedFiles,
                          classAValidation.setFieldValue,
                          setPanCardUpload, // Set the state for panCard
                          "panCardUpload" // Field name dynamically passed
                        )
                      }
                    >
                      {({ getRootProps, getInputProps }) => (
                        <div className="dropzone">
                          <div
                            className="dz-message needsclick mt-2"
                            {...getRootProps()}
                          >
                            <input {...getInputProps()} />
                            <i className="display-4 text-muted bx bx-cloud-upload" />
                          </div>
                        </div>
                      )}
                    </Dropzone>
                    <div className="dropzone-previews mt-3" id="file-previews">
                      {panCardUpload.map((file, i) => (
                        <Card
                          className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                          key={i + "-file"}
                        >
                          <div className="p-2">
                            <Row className="align-items-center">
                              <Col className="col-auto">
                                {file.type.startsWith("image/") ? (
                                  <>
                                    <img
                                      src={file.preview}
                                      height="70"
                                      width="70"
                                      style={{ marginTop: "15px" }}
                                      alt={file.name}
                                    />
                                    <p
                                      style={{
                                        color: "rgb(245 146 34)",
                                        marginTop: "5px",
                                      }}
                                    >
                                      {file.name}
                                    </p>
                                  </>
                                ) : file.type === "application/pdf" ? (
                                  <a
                                    href={file.preview}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <i className="far fa-file-pdf fa-2x text-danger"></i>
                                    <p>{file.name}</p>
                                  </a>
                                ) : (
                                  <p>Unsupported file type</p>
                                )}
                              </Col>
                            </Row>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                  {classAValidation?.errors?.panCardUpload ? (
                    <span style={{ color: "red" }}>
                      {classAValidation?.errors?.panCardUpload}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <div className="mb-3">
                  <div className="mb-3">
                    <Label className="form-label">Upload Aadhar Card</Label>
                    <Dropzone
                      onDrop={(acceptedFiles) =>
                        handleFileUpload(
                          acceptedFiles,
                          classAValidation.setFieldValue,
                          setAadharCardUpload, // Set the state for panCard
                          "aadharCardUpload" // Field name dynamically passed
                        )
                      }
                    >
                      {({ getRootProps, getInputProps }) => (
                        <div className="dropzone">
                          <div
                            className="dz-message needsclick mt-2"
                            {...getRootProps()}
                          >
                            <input {...getInputProps()} />
                            <i className="display-4 text-muted bx bx-cloud-upload" />
                          </div>
                        </div>
                      )}
                    </Dropzone>
                    <div className="dropzone-previews mt-3" id="file-previews">
                      {aadharCardUpload.map((file, i) => (
                        <Card
                          className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                          key={i + "-file"}
                        >
                          <div className="p-2">
                            <Row className="align-items-center">
                              <Col className="col-auto">
                                {file.type.startsWith("image/") ? (
                                  <>
                                    <img
                                      src={file.preview}
                                      height="70"
                                      width="70"
                                      style={{ marginTop: "15px" }}
                                      alt={file.name}
                                    />
                                    <p
                                      style={{
                                        color: "rgb(245 146 34)",
                                        marginTop: "5px",
                                      }}
                                    >
                                      {file.name}
                                    </p>
                                  </>
                                ) : file.type === "application/pdf" ? (
                                  <a
                                    href={file.preview}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <i className="far fa-file-pdf fa-2x text-danger"></i>
                                    <p>{file.name}</p>
                                  </a>
                                ) : (
                                  <p>Unsupported file type</p>
                                )}
                              </Col>
                            </Row>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                  {classAValidation?.errors?.aadharCardUpload ? (
                    <span style={{ color: "red" }}>
                      {classAValidation?.errors?.aadharCardUpload}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="col-lg-6">
                <div className="mb-3">
                  <div className="mb-3">
                    <Label className="form-label">Upload GST Number</Label>
                    <Dropzone
                      onDrop={(acceptedFiles) =>
                        handleFileUpload(
                          acceptedFiles,
                          classAValidation.setFieldValue,
                          setGSTNumberUpload, // Set the state for panCard
                          "gstNumberUpload" // Field name dynamically passed
                        )
                      }
                    >
                      {({ getRootProps, getInputProps }) => (
                        <div className="dropzone">
                          <div
                            className="dz-message needsclick mt-2"
                            {...getRootProps()}
                          >
                            <input {...getInputProps()} />
                            <i className="display-4 text-muted bx bx-cloud-upload" />
                          </div>
                        </div>
                      )}
                    </Dropzone>
                    <div className="dropzone-previews mt-3" id="file-previews">
                      {gstNumberUpload.map((file, i) => (
                        <Card
                          className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                          key={i + "-file"}
                        >
                          <div className="p-2">
                            <Row className="align-items-center">
                              <Col className="col-auto">
                                {file.type.startsWith("image/") ? (
                                  <>
                                    <img
                                      src={file.preview}
                                      height="70"
                                      width="70"
                                      style={{ marginTop: "15px" }}
                                      alt={file.name}
                                    />
                                    <p
                                      style={{
                                        color: "rgb(245 146 34)",
                                        marginTop: "5px",
                                      }}
                                    >
                                      {file.name}
                                    </p>
                                  </>
                                ) : file.type === "application/pdf" ? (
                                  <a
                                    href={file.preview}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <i className="far fa-file-pdf fa-2x text-danger"></i>
                                    <p>{file.name}</p>
                                  </a>
                                ) : (
                                  <p>Unsupported file type</p>
                                )}
                              </Col>
                            </Row>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                  {classAValidation?.errors?.gstNumberUpload ? (
                    <span style={{ color: "red" }}>
                      {classAValidation?.errors?.gstNumberUpload}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <div className="mb-3">
                  <div className="mb-3">
                    <Label className="form-label">Cancel Cheque Upload</Label>
                    <Dropzone
                      onDrop={(acceptedFiles) =>
                        handleFileUpload(
                          acceptedFiles,
                          classAValidation.setFieldValue,
                          setCancelChequeUpload, // Set the state for panCard
                          "cancelChequeUpload" // Field name dynamically passed
                        )
                      }
                    >
                      {({ getRootProps, getInputProps }) => (
                        <div className="dropzone">
                          <div
                            className="dz-message needsclick mt-2"
                            {...getRootProps()}
                          >
                            <input {...getInputProps()} />
                            <i className="display-4 text-muted bx bx-cloud-upload" />
                          </div>
                        </div>
                      )}
                    </Dropzone>
                    <div className="dropzone-previews mt-3" id="file-previews">
                      {cancelChequeUpload.map((file, i) => (
                        <Card
                          className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                          key={i + "-file"}
                        >
                          <div className="p-2">
                            <Row className="align-items-center">
                              <Col className="col-auto">
                                {file.type.startsWith("image/") ? (
                                  <>
                                    <img
                                      src={file.preview}
                                      height="70"
                                      width="70"
                                      style={{ marginTop: "15px" }}
                                      alt={file.name}
                                    />
                                    <p
                                      style={{
                                        color: "rgb(245 146 34)",
                                        marginTop: "5px",
                                      }}
                                    >
                                      {file.name}
                                    </p>
                                  </>
                                ) : file.type === "application/pdf" ? (
                                  <a
                                    href={file.preview}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <i className="far fa-file-pdf fa-2x text-danger"></i>
                                    <p>{file.name}</p>
                                  </a>
                                ) : (
                                  <p>Unsupported file type</p>
                                )}
                              </Col>
                            </Row>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                  {classAValidation?.errors?.cancelChequeUpload ? (
                    <span style={{ color: "red" }}>
                      {classAValidation?.errors?.cancelChequeUpload}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="col-lg-6">
                <div className="mb-3">
                  <label>Delivery Time Line</label>
                  <Select
                    name="deliveryTimeLine"
                    id="deliveryTimeLine"
                    options={deliveryTimeLineOptions}
                    onChange={(selectedOption) =>
                      handleDeliveryTimeLine(
                        selectedOption,
                        classAValidation.setFieldValue
                      )
                    }
                    onBlur={() =>
                      classAValidation.setFieldTouched("deliveryTimeLine", true)
                    }
                  />
                  {classAValidation?.errors?.deliveryTimeLine ? (
                    <span style={{ color: "red" }}>
                      {classAValidation?.errors?.deliveryTimeLine}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <div className="mb-3">
                  <label>Available Black Haul</label>
                  <Select
                    isMulti
                    name="availableBlackHaul"
                    id="availableBlackHaul"
                    options={BlackHaulOptions}
                    onChange={(selectedOptions) =>
                      handleAvailableBlackHaul(
                        selectedOptions,
                        classAValidation.setFieldValue
                      )
                    }
                    onBlur={() =>
                      classAValidation.setFieldTouched(
                        "availableBlackHaul",
                        true
                      )
                    }
                  />
                  {classAValidation?.errors?.availableBlackHaul ? (
                    <span style={{ color: "red" }}>
                      {classAValidation?.errors?.availableBlackHaul}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="col-lg-6">
                <div className="mb-3">
                  <label>Media</label>
                  <Select
                    isMulti
                    name="media"
                    id="media"
                    options={mediaOptions}
                    onChange={(selectedOptions) =>
                      handleMedia(
                        selectedOptions,
                        classAValidation.setFieldValue
                      )
                    }
                    onBlur={() =>
                      classAValidation.setFieldTouched("media", true)
                    }
                  />
                  {classAValidation?.errors?.media ? (
                    <span style={{ color: "red" }}>
                      {classAValidation?.errors?.media}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <div className="mb-3">
                  <label>Services</label>
                  <Select
                    isMulti
                    name="services"
                    options={servicesDropdown}
                    onChange={(selectedOptions) =>
                      handleServices(
                        selectedOptions,
                        classAValidation.setFieldValue
                      )
                    }
                    onBlur={() =>
                      classAValidation.setFieldTouched("services", true)
                    }
                  />
                  {classAValidation?.errors?.services ? (
                    <span style={{ color: "red" }}>
                      {classAValidation?.errors?.services}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="col-lg-6">
                <div className="mb-3">
                  <label htmlFor="contractPeriod" className="form-label">
                    Contract Period
                  </label>
                  <Select
                    id="contractPeriod"
                    name="contractPeriod"
                    options={[
                      { value: "6_months", label: "Six Months" },
                      { value: "1_year", label: "1 Year" },
                      { value: "2_year", label: "2 Years" },
                      { value: "3_year", label: "3 Years" },
                      { value: "4_year", label: "4 Years" },
                      { value: "5_year", label: "5 Years" },
                      { value: "6_year", label: "6 Years" },
                      { value: "7_year", label: "7 Years" },
                      { value: "8_year", label: "8 Years" },
                      { value: "9_year", label: "9 Years" },
                      { value: "10_year", label: "10 Years" },
                    ]}
                    value={{
                      value: classAValidation.values.contractPeriod,
                      label: classAValidation.values.contractPeriod.replace(
                        "_",
                        " "
                      ),
                    }}
                    onChange={(selectedOption) =>
                      classAValidation.setFieldValue(
                        "contractPeriod",
                        selectedOption.value
                      )
                    }
                    onBlur={() =>
                      classAValidation.handleBlur({
                        target: { name: "contractPeriod" },
                      })
                    }
                    className="basic-single"
                    classNamePrefix="select"
                    placeholder="Select Contract Period"
                  />
                  {classAValidation.errors.contractPeriod ? (
                    <span style={{ color: "red" }}>
                      {classAValidation.errors.contractPeriod}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <div className="mb-3">
                  <label>Payment Mode</label>
                  <Select
                    isMulti
                    name="paymentMode"
                    id="paymentMode"
                    options={paymentModeDropdown}
                    onChange={(selectedOptions) =>
                      handlePaymentMode(
                        selectedOptions,
                        classAValidation.setFieldValue
                      )
                    }
                    onBlur={() =>
                      classAValidation.setFieldTouched("paymentMode", true)
                    }
                  />
                  {classAValidation?.errors?.paymentMode ? (
                    <span style={{ color: "red" }}>
                      {classAValidation?.errors?.paymentMode}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </TabPane>

          <TabPane tabId={3}>
            <div className="text-center mb-4">
              <h5>Bandwith (Limited)</h5>
            </div>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Bandwidth</th>
                    <th>OTC</th>
                    <th>Bill Options</th>
                    <th>Bill Option Price</th>
                    <th>Total Price (Incl. GST)</th>
                  </tr>
                </thead>
                <tbody>
                  {options.map((option, index) => {
                    const bandwidthData =
                      classAValidation.values.bandwidth?.[index] || {};
                    const otc = parseFloat(bandwidthData.otc || 0);
                    const billOptionPrice = parseFloat(
                      bandwidthData.billOptionPrice || 0
                    );
                    const totalPrice = otc + billOptionPrice * 1.18;

                    return (
                      <tr key={option.value}>
                        <td>{option.label}</td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            name={`bandwidth[${index}].otc`}
                            value={bandwidthData.otc || ""}
                            onChange={(e) => handleInputChange(e, index, "otc")}
                            placeholder="Enter OTC"
                          />
                        </td>
                        <td>
                          <Select
                            name={`bandwidth[${index}].billOption`}
                            options={billOptions}
                            value={billOptions.find(
                              (opt) => opt.value === bandwidthData.billOption
                            )}
                            onChange={(selectedOption) =>
                              handleSelectChange(selectedOption, index)
                            }
                            placeholder="Select Bill Option"
                          />
                        </td>
                        <td>
                          {bandwidthData.billOption && (
                            <input
                              type="number"
                              className="form-control"
                              name={`bandwidth[${index}].billOptionPrice`}
                              value={bandwidthData.billOptionPrice || ""}
                              onChange={(e) =>
                                handleInputChange(e, index, "billOptionPrice")
                              }
                              placeholder="Enter Price"
                            />
                          )}
                        </td>
                        <td>
                          <strong>₹ {totalPrice.toFixed(2)}</strong>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {classAValidation.errors.bandwidth && (
                <span style={{ color: "red" }}>
                  {classAValidation.errors.bandwidth}
                </span>
              )}
            </div>
          </TabPane>

          <TabPane tabId={4}>
            <div className="text-center mb-4">
              <h5>Bandwith (Unlimited)</h5>
            </div>
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Bandwidth</th>
                    <th>OTC</th>
                    <th>Bill Options</th>
                    <th>Bill Option Price</th>
                    <th>Total Price (Incl. GST)</th>
                  </tr>
                </thead>
                <tbody>
                  {options.map((option, index) => {
                    const bandwidthData =
                      classAValidation.values.unlimitedbandwidth?.[index] || {};
                    const otc = parseFloat(bandwidthData.otc || 0);
                    const billOptionPrice = parseFloat(
                      bandwidthData.billOptionPrice || 0
                    );
                    const totalPrice = otc + billOptionPrice * 1.18;

                    return (
                      <tr key={option.value}>
                        <td>{option.label}</td>
                        <td>
                          <input
                            type="number"
                            className="form-control"
                            name={`bandwidth[${index}].otc`}
                            value={bandwidthData.otc || ""}
                            onChange={(e) =>
                              handleInputChangeUnlimitedBandwidth(
                                e,
                                index,
                                "otc"
                              )
                            }
                            placeholder="Enter OTC"
                          />
                        </td>
                        <td>
                          <Select
                            name={`bandwidth[${index}].billOption`}
                            options={billOptions}
                            value={billOptions.find(
                              (opt) => opt.value === bandwidthData.billOption
                            )}
                            onChange={(selectedOption) =>
                              handleSelectChangeUnlimitedBandwidth(
                                selectedOption,
                                index
                              )
                            }
                            placeholder="Select Bill Option"
                          />
                        </td>
                        <td>
                          {bandwidthData.billOption && (
                            <input
                              type="number"
                              className="form-control"
                              name={`bandwidth[${index}].billOptionPrice`}
                              value={bandwidthData.billOptionPrice || ""}
                              onChange={(e) =>
                                handleInputChangeUnlimitedBandwidth(
                                  e,
                                  index,
                                  "billOptionPrice"
                                )
                              }
                              placeholder="Enter Price"
                            />
                          )}
                        </td>
                        <td>
                          <strong>₹ {totalPrice.toFixed(2)}</strong>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {classAValidation.errors.unlimitedbandwidth && (
                <span style={{ color: "red" }}>
                  {classAValidation.errors.unlimitedbandwidth}
                </span>
              )}
            </div>
            {/* <div className="row">
              <div className="col-lg-3">
                <div className="mb-3">
                  <label>Bandwidth (Limited)</label>
                  <Select
                    name="fupLimited"
                    id="fupLimited"
                    options={fupLimitedOptions}
                    onChange={(selectedOptions) =>
                      handleFupLimited(
                        selectedOptions,
                        classAValidation.setFieldValue
                      )
                    }
                    onBlur={() =>
                      classAValidation.setFieldTouched("fupLimited", true)
                    }
                  />
                  {classAValidation?.errors?.fupLimited ? (
                    <span style={{ color: "red" }}>
                      {classAValidation?.errors?.fupLimited}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="col-lg-3">
                <div className="mb-3">
                  <label
                    htmlFor="basicpill-fupLimitedCost-input"
                    className="form-label"
                  >
                    Bandwidth Limited
                  </label>
                  <input
                    id="fupLimitedCost"
                    type="number"
                    name="fupLimitedCost"
                    onChange={classAValidation.handleChange}
                    onBlur={classAValidation.handleChange}
                    value={classAValidation.values.fupLimitedCost}
                    className="form-control"
                    placeholder="Enter Your Bandwidth Limited Cost"
                  />
                  {classAValidation.errors.fupLimitedCost ? (
                    <span style={errorStyle}>
                      {classAValidation.errors.fupLimitedCost}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="col-lg-3">
                <div className="mb-3">
                  <label
                    htmlFor="basicpill-fupLimitedCost-input"
                    className="form-label"
                  >
                    Bandwidth Limited
                  </label>
                  <input
                    id="fupLimitedCost"
                    type="number"
                    name="fupLimitedCost"
                    onChange={classAValidation.handleChange}
                    onBlur={classAValidation.handleChange}
                    value={classAValidation.values.fupLimitedCost}
                    className="form-control"
                    placeholder="Enter Your Bandwidth Limited Cost"
                  />
                  {classAValidation.errors.fupLimitedCost ? (
                    <span style={errorStyle}>
                      {classAValidation.errors.fupLimitedCost}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="col-lg-3">
                <div className="mb-3">
                  <label
                    htmlFor="basicpill-fupLimitedCost-input"
                    className="form-label"
                  >
                    Bandwidth Limited
                  </label>
                  <input
                    id="fupLimitedCost"
                    type="number"
                    name="fupLimitedCost"
                    onChange={classAValidation.handleChange}
                    onBlur={classAValidation.handleChange}
                    value={classAValidation.values.fupLimitedCost}
                    className="form-control"
                    placeholder="Enter Your Bandwidth Limited Cost"
                  />
                  {classAValidation.errors.fupLimitedCost ? (
                    <span style={errorStyle}>
                      {classAValidation.errors.fupLimitedCost}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <div className="mb-3">
                  <label htmlFor="basicpill-otc-input" className="form-label">
                    One Time Cost (OTC)
                  </label>
                  <input
                    id="otc"
                    type="text"
                    name="otc"
                    onChange={classAValidation.handleChange}
                    onBlur={classAValidation.handleChange}
                    value={classAValidation.values.otc}
                    className="form-control"
                    placeholder="Enter Your One Time Cost"
                  />
                  {classAValidation.errors.otc ? (
                    <span style={errorStyle}>
                      {classAValidation.errors.otc}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <div className="mb-3">
                  <label>Billing Option</label>
                  <Select
                    name="billingOption"
                    id="billingOption"
                    options={[
                      { value: "MRC", label: "Monthly Recurring Cost (MRC)" },
                      { value: "QRC", label: "Quarterly Recurring Cost (QRC)" },
                      { value: "HRC", label: "Half Recurring Cost (HRC)" },
                      { value: "ARC", label: "Annual Recurring Cost (ARC)" },
                    ]}
                    onChange={(selectedOption) => {
                      classAValidation.setFieldValue(
                        "billingOption",
                        selectedOption.value
                      );
                      classAValidation.setFieldValue("billingAmount", ""); // Reset amount when option changes
                    }}
                    onBlur={() =>
                      classAValidation.setFieldTouched("billingOption", true)
                    }
                  />
                  {classAValidation?.errors?.billingOption ? (
                    <span style={{ color: "red" }}>
                      {classAValidation?.errors?.billingOption}
                    </span>
                  ) : null}
                </div>
              </div>

              {classAValidation.values.billingOption && (
                <div className="col-lg-6">
                  <div className="mb-3">
                    <label
                      htmlFor="basicpill-billing-amount-input"
                      className="form-label"
                    >
                      Enter Price (GST Included)
                    </label>
                    <input
                      id="billingAmount"
                      type="number"
                      name="billingAmount"
                      onChange={classAValidation.handleChange}
                      onBlur={classAValidation.handleBlur}
                      value={classAValidation.values.billingAmount}
                      className="form-control"
                      placeholder="Enter Price"
                    />
                    {classAValidation.errors.billingAmount ? (
                      <span style={{ color: "red" }}>
                        {classAValidation.errors.billingAmount}
                      </span>
                    ) : null}
                  </div>
                </div>
              )}

              {classAValidation.values.billingAmount && (
                <div className="col-lg-12">
                  <div className="mb-3">
                    <p>
                      <strong>Total Price (GST 18%): </strong>₹
                      {(
                        parseFloat(classAValidation.values.billingAmount) * 1.18
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="row">
              <div className="col-lg-6">
                <div className="mb-3">
                  <label>Available Black Haul</label>
                  <Select
                    isMulti
                    name="availableBlackHaul"
                    id="availableBlackHaul"
                    options={BlackHaulOptions}
                    onChange={(selectedOptions) =>
                      handleAvailableBlackHaul(
                        selectedOptions,
                        classAValidation.setFieldValue
                      )
                    }
                    onBlur={() =>
                      classAValidation.setFieldTouched(
                        "availableBlackHaul",
                        true
                      )
                    }
                  />
                  {classAValidation?.errors?.availableBlackHaul ? (
                    <span style={{ color: "red" }}>
                      {classAValidation?.errors?.availableBlackHaul}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="col-lg-6">
                <div className="mb-3">
                  <label>Media</label>
                  <Select
                    isMulti
                    name="media"
                    id="media"
                    options={mediaOptions}
                    onChange={(selectedOptions) =>
                      handleMedia(
                        selectedOptions,
                        classAValidation.setFieldValue
                      )
                    }
                    onBlur={() =>
                      classAValidation.setFieldTouched("media", true)
                    }
                  />
                  {classAValidation?.errors?.media ? (
                    <span style={{ color: "red" }}>
                      {classAValidation?.errors?.media}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <div className="mb-3">
                  <label>Services</label>
                  <Select
                    isMulti
                    name="services"
                    options={servicesDropdown}
                    onChange={(selectedOptions) =>
                      handleServices(
                        selectedOptions,
                        classAValidation.setFieldValue
                      )
                    }
                    onBlur={() =>
                      classAValidation.setFieldTouched("services", true)
                    }
                  />
                  {classAValidation?.errors?.services ? (
                    <span style={{ color: "red" }}>
                      {classAValidation?.errors?.services}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="col-lg-6">
                <div className="mb-3">
                  <label
                    htmlFor="basicpill-contractPeriod-input"
                    className="form-label"
                  >
                    Contract Period (Year)
                  </label>
                  <input
                    id="contractPeriod"
                    type="text"
                    name="contractPeriod"
                    onChange={classAValidation.handleChange}
                    onBlur={classAValidation.handleChange}
                    value={classAValidation.values.contractPeriod}
                    className="form-control"
                    placeholder="Enter Your Contract Period"
                  />
                  {classAValidation.errors.contractPeriod ? (
                    <span style={errorStyle}>
                      {classAValidation.errors.contractPeriod}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <div className="mb-3">
                  <label>Payment Mode</label>
                  <Select
                    isMulti
                    name="paymentMode"
                    id="paymentMode"
                    options={paymentModeDropdown}
                    onChange={(selectedOptions) =>
                      handlePaymentMode(
                        selectedOptions,
                        classAValidation.setFieldValue
                      )
                    }
                    onBlur={() =>
                      classAValidation.setFieldTouched("paymentMode", true)
                    }
                  />
                  {classAValidation?.errors?.paymentMode ? (
                    <span style={{ color: "red" }}>
                      {classAValidation?.errors?.paymentMode}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <div className="mb-3">
                  <label>Bandwidth (Unlimited)</label>
                  <Select
                    isMulti
                    name="unlimited"
                    id="unlimited"
                    options={fupLimitedOptions}
                    onChange={(selectedOptions) =>
                      handleUnlimited(
                        selectedOptions,
                        classAValidation.setFieldValue
                      )
                    }
                    onBlur={() =>
                      classAValidation.setFieldTouched("unlimited", true)
                    }
                  />
                  {classAValidation?.errors?.unlimited ? (
                    <span style={{ color: "red" }}>
                      {classAValidation?.errors?.unlimited}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="col-lg-6">
                <div className="mb-3">
                  <label
                    htmlFor="basicpill-unlimitedCost-input"
                    className="form-label"
                  >
                    Bandwidth Unlimited Cost
                  </label>
                  <input
                    id="unlimitedCost"
                    type="number"
                    name="unlimitedCost"
                    onChange={classAValidation.handleChange}
                    onBlur={classAValidation.handleChange}
                    value={classAValidation.values.unlimitedCost}
                    className="form-control"
                    placeholder="Enter Your Unlimited Cost"
                  />
                  {classAValidation.errors.unlimitedCost ? (
                    <span style={errorStyle}>
                      {classAValidation.errors.unlimitedCost}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <div className="mb-3">
                  <label>Delivery Time Line</label>
                  <Select
                    name="deliveryTimeLine"
                    id="deliveryTimeLine"
                    options={deliveryTimeLineOptions}
                    onChange={(selectedOption) =>
                      handleDeliveryTimeLine(
                        selectedOption,
                        classAValidation.setFieldValue
                      )
                    }
                    onBlur={() =>
                      classAValidation.setFieldTouched("deliveryTimeLine", true)
                    }
                  />
                  {classAValidation?.errors?.deliveryTimeLine ? (
                    <span style={{ color: "red" }}>
                      {classAValidation?.errors?.deliveryTimeLine}
                    </span>
                  ) : null}
                </div>
              </div>
            </div> */}
          </TabPane>

          <TabPane tabId={5}>
            <div className="text-center mb-4">
              <h5>Service Coverage Area</h5>
            </div>

            <div>
              <div className="mb-4">
                <label htmlFor="pincode" className="form-label">
                  Enter Pincode
                </label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  className="form-control"
                  placeholder="Enter Pincode"
                  value={pincode}
                  onChange={handlePincodeChange}
                />
                {errors.pincode ? (
                  <span style={errorStyle}>{errors.pincode}</span>
                ) : null}
              </div>

              <div className="mb-4">
                <label htmlFor="serviceCoverage" className="form-label">
                  Service Coverage Area
                </label>
                <Select
                  id="serviceCoverage"
                  isMulti
                  options={locationData}
                  value={selectedLocations}
                  onChange={handleLocationChange}
                  placeholder="Select Service Coverage Area"
                  noOptionsMessage={() =>
                    locationData.length === 0
                      ? "Enter a valid pincode to fetch locations"
                      : "No options available"
                  }
                />
                {errors.serviceCoverage ? (
                  <span style={errorStyle}>{errors.serviceCoverage}</span>
                ) : null}
              </div>

              <div className="text-center">
                <button onClick={handleSubmit} className="btn btn-primary">
                  Submit
                </button>
              </div>

              {classAValidation.errors.serviceCoverage && (
                <span style={{ color: "red" }}>
                  {classAValidation.errors.serviceCoverage}
                </span>
              )}
              <div className="mt-4">
                <h5>Saved Details</h5>
                {savedDetails.length === 0 ? (
                  <p>No details saved yet.</p>
                ) : (
                  <ul className="list-group">
                    {savedDetails.map((detail, index) => (
                      <li key={index} className="list-group-item">
                        <strong>Pincode:</strong> {detail.pincode}
                        <br />
                        <strong>Locations:</strong>{" "}
                        {detail.locations.map((loc) => loc.label).join(", ")}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </TabPane>

          <TabPane tabId={6}>
            <div className="text-center mb-4">
              <h5>Bank Details</h5>
              <p className="card-title-desc">Fill all information below</p>
            </div>
            <div className="row">
              <div className="col-lg-6">
                <div className="mb-3">
                  <label htmlFor="bankName" className="form-label">
                    Bank Name
                  </label>
                  <select
                    id="bankName"
                    name="bankDetails.bankName"
                    value={classAValidation.values.bankDetails.bankName}
                    onChange={classAValidation.handleChange}
                    onBlur={classAValidation.handleBlur}
                    className="form-control"
                  >
                    <option value="" disabled>
                      Select Bank
                    </option>
                    {Object.entries(Banks).map(([code, name]) => (
                      <option key={code} value={code}>
                        {name}
                      </option>
                    ))}
                  </select>
                  {classAValidation.errors.bankDetails?.bankName ? (
                    <span style={{ color: "red" }}>
                      {classAValidation.errors.bankDetails.bankName}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="col-lg-6">
                <div>
                  <label>Account Type</label>
                  <Select
                    options={bankAccount}
                    onChange={(option) =>
                      classAValidation.setFieldValue(
                        "bankDetails.accountType",
                        option.value
                      )
                    }
                    name="bankDetails.accountType"
                  />
                  {classAValidation.errors.bankDetails?.accountType ? (
                    <div style={{ color: "red" }}>
                      {classAValidation.errors.bankDetails.accountType}
                    </div>
                  ) : null}
                </div>
              </div>
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
                    name="bankDetails.accountNumber" // Nested path
                    value={classAValidation.values.bankDetails.accountNumber}
                    onChange={classAValidation.handleChange}
                    onBlur={classAValidation.handleBlur}
                  />
                  {classAValidation.errors.bankDetails?.accountNumber ? (
                    <span style={{ color: "red" }}>
                      {classAValidation.errors.bankDetails.accountNumber}
                    </span>
                  ) : null}
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
                    name="bankDetails.cnfmAccountNumber" // Nested path
                    value={
                      classAValidation.values.bankDetails.cnfmAccountNumber
                    }
                    onChange={classAValidation.handleChange}
                    onBlur={classAValidation.handleBlur}
                  />
                  {classAValidation.errors.bankDetails?.cnfmAccountNumber ? (
                    <span style={{ color: "red" }}>
                      {classAValidation.errors.bankDetails.cnfmAccountNumber}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="col-lg-6">
                {" "}
                <div className="mb-3">
                  <label
                    htmlFor="basicpill-cardno-input"
                    className="form-label"
                  >
                    Account Holder Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="basicpill-cardno-input"
                    name="bankDetails.accountHolderName"
                    value={
                      classAValidation.values.bankDetails.accountHolderName
                    }
                    onChange={classAValidation.handleChange}
                    onBlur={classAValidation.handleBlur}
                  />
                  {classAValidation.errors.bankDetails?.accountHolderName ? (
                    <span style={{ color: "red" }}>
                      {classAValidation.errors.bankDetails.accountHolderName}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="col-lg-6">
                <div className="mb-3">
                  <label
                    htmlFor="basicpill-cardno-input"
                    className="form-label"
                  >
                    IFSC Code{" "}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="basicpill-cardno-input"
                    name="bankDetails.ifscCode"
                    value={classAValidation.values.bankDetails.ifscCode}
                    onChange={classAValidation.handleChange}
                    onBlur={classAValidation.handleBlur}
                  />
                  {classAValidation.errors.bankDetails?.ifscCode ? (
                    <span style={{ color: "red" }}>
                      {classAValidation.errors.bankDetails.ifscCode}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="col-lg-6">
                <div className="mb-3">
                  <label
                    htmlFor="basicpill-cardno-input"
                    className="form-label"
                  >
                    Branch Name{" "}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="basicpill-cardno-input"
                    name="bankDetails.branchName"
                    value={classAValidation.values.bankDetails.branchName}
                    onChange={classAValidation.handleChange}
                    onBlur={classAValidation.handleBlur}
                  />
                  {classAValidation.errors.bankDetails?.branchName ? (
                    <span style={{ color: "red" }}>
                      {classAValidation.errors.bankDetails.branchName}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </TabPane>

          <TabPane tabId={7}>
            <div className="text-center mb-4">
              <h5>Address Details</h5>
              <p className="card-title-desc">Fill all information below</p>
            </div>
            <div className="row">
              {/* Checkbox for Copying Address */}
              <div className="col-lg-12">
                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="sameAddress"
                    onChange={(e) => {
                      if (e.target.checked) {
                        classAValidation.setFieldValue(
                          "officeAddress",
                          classAValidation.values.permanentAddress
                        );
                      } else {
                        classAValidation.setFieldValue("officeAddress", {
                          pinCode: "",
                          street: "",
                          city: "",
                          state: "",
                          country: "",
                        });
                      }
                    }}
                  />
                  <label className="form-check-label" htmlFor="sameAddress">
                    Same as Permanent Address
                  </label>
                </div>
              </div>

              {/* Permanent Address on Left & Office Address on Right */}
              <div className="row">
                <div className="col-lg-6">
                  <h5>Permanent Address</h5>
                  {["pinCode", "street", "city", "state", "country"].map(
                    (field) => (
                      <div className="mb-3" key={`permanent-${field}`}>
                        <label className="form-label">
                          {field.charAt(0).toUpperCase() + field.slice(1)}
                        </label>
                        <input
                          type={field === "pinCode" ? "number" : "text"}
                          name={`permanentAddress.${field}`}
                          value={
                            classAValidation.values.permanentAddress[field] ||
                            ""
                          }
                          onChange={classAValidation.handleChange}
                          onBlur={classAValidation.handleBlur}
                          className="form-control"
                        />
                        {classAValidation.errors.permanentAddress?.[field] && (
                          <span style={{ color: "red" }}>
                            {classAValidation.errors.permanentAddress[field]}
                          </span>
                        )}
                      </div>
                    )
                  )}
                </div>

                <div className="col-lg-6">
                  <h5>Office Address</h5>
                  {["pinCode", "street", "city", "state", "country"].map(
                    (field) => (
                      <div className="mb-3" key={`office-${field}`}>
                        <label className="form-label">
                          {field.charAt(0).toUpperCase() + field.slice(1)}
                        </label>
                        <input
                          type={field === "pinCode" ? "number" : "text"}
                          name={`officeAddress.${field}`}
                          value={classAValidation.values.officeAddress[field]}
                          onChange={classAValidation.handleChange}
                          onBlur={classAValidation.handleBlur}
                          className="form-control"
                        />
                        {classAValidation.errors.officeAddress?.[field] && (
                          <span style={{ color: "red" }}>
                            {classAValidation.errors.officeAddress[field]}
                          </span>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </TabPane>

          <TabPane tabId={8}>
            <div className="text-center mb-4">
              <h5>Escalation Matrix</h5>
              <p className="card-title-desc">Fill all information below</p>
            </div>
            {[1, 2, 3].map((personIndex) => (
              <div key={personIndex} className="row mb-4">
                <h6 className="text-center">Level {personIndex}</h6>
                <div className="col-lg-6">
                  <div className="mb-3">
                    <label
                      htmlFor={`escalationMatrixName${personIndex}`}
                      className="form-label"
                    >
                      Name
                    </label>
                    <input
                      id={`escalationMatrixName${personIndex}`}
                      type="text"
                      name={`escalationMatrix[${personIndex - 1}].name`}
                      onChange={classAValidation.handleChange}
                      onBlur={classAValidation.handleBlur}
                      value={
                        classAValidation.values.escalationMatrix?.[
                          personIndex - 1
                        ]?.name || ""
                      }
                      className="form-control"
                      placeholder={`Enter Name for Person ${personIndex}`}
                    />
                    {classAValidation.errors.escalationMatrix?.[personIndex - 1]
                      ?.name ? (
                      <span style={errorStyle}>
                        {
                          classAValidation.errors.escalationMatrix[
                            personIndex - 1
                          ]?.name
                        }
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="mb-3">
                    <label
                      htmlFor={`escalationMatrixContactOne${personIndex}`}
                      className="form-label"
                    >
                      Contact
                    </label>
                    <input
                      id={`escalationMatrixContactOne${personIndex}`}
                      type="text"
                      name={`escalationMatrix[${personIndex - 1}].contactOne`}
                      onChange={classAValidation.handleChange}
                      onBlur={classAValidation.handleBlur}
                      value={
                        classAValidation.values.escalationMatrix?.[
                          personIndex - 1
                        ]?.contactOne || ""
                      }
                      className="form-control"
                      placeholder={`Enter Contact for Person ${personIndex}`}
                    />
                    {classAValidation.errors.escalationMatrix?.[personIndex - 1]
                      ?.contactOne ? (
                      <span style={errorStyle}>
                        {
                          classAValidation.errors.escalationMatrix[
                            personIndex - 1
                          ]?.contactOne
                        }
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="mb-3">
                    <label
                      htmlFor={`escalationMatrixEmail${personIndex}`}
                      className="form-label"
                    >
                      Email
                    </label>
                    <input
                      id={`escalationMatrixEmail${personIndex}`}
                      type="email"
                      name={`escalationMatrix[${personIndex - 1}].email`}
                      onChange={classAValidation.handleChange}
                      onBlur={classAValidation.handleBlur}
                      value={
                        classAValidation.values.escalationMatrix?.[
                          personIndex - 1
                        ]?.email || ""
                      }
                      className="form-control"
                      placeholder={`Enter Email for Person ${personIndex}`}
                    />
                    {classAValidation.errors.escalationMatrix?.[personIndex - 1]
                      ?.email ? (
                      <span style={errorStyle}>
                        {
                          classAValidation.errors.escalationMatrix[
                            personIndex - 1
                          ]?.email
                        }
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="mb-3">
                    <label
                      htmlFor={`escalationMatrixDesignation${personIndex}`}
                      className="form-label"
                    >
                      Designation
                    </label>
                    <input
                      id={`escalationMatrixDesignation${personIndex}`}
                      type="text"
                      name={`escalationMatrix[${personIndex - 1}].designation`}
                      onChange={classAValidation.handleChange}
                      onBlur={classAValidation.handleBlur}
                      value={
                        classAValidation.values.escalationMatrix?.[
                          personIndex - 1
                        ]?.designation || ""
                      }
                      className="form-control"
                      placeholder={`Enter Designation for Person ${personIndex}`}
                    />
                    {classAValidation.errors.escalationMatrix?.[personIndex - 1]
                      ?.designation ? (
                      <span style={errorStyle}>
                        {
                          classAValidation.errors.escalationMatrix[
                            personIndex - 1
                          ]?.designation
                        }
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </TabPane>
        </TabContent>

        {/* Next Previous */}
        <ul className="pager wizard twitter-bs-wizard-pager-link">
          <li className={activeTab === 1 ? "previous disabled" : "previous"}>
            <Link
              to="#"
              className={
                activeTab === 1 ? "btn btn-primary disabled" : "btn btn-primary"
              }
              onClick={() => {
                toggleTab(activeTab - 1);
              }}
            >
              <i className="bx bx-chevron-left me-1"></i> Previous
            </Link>
          </li>

          {activeTab > 7 ? (
            <li className="next">
              <button
                className="btn btn-primary w-100 waves-effect waves-light"
                onClick={submitFormToAPI}
              >
                save
              </button>
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
    </React.Fragment>
  );
};

export default ClassARegister;
