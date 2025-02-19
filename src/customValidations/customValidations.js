// ticketIDValidation.js
import moment from "moment";
import * as Yup from "yup";

export const ticketIDValidation = Yup.string()
  .matches(
    /^INSTA\d{4}$/,
    "Ticket ID must start with 'INSTA' followed by exactly four digits"
  )
  .required("Ticket ID is required");

export const ticketNameValidation = Yup.string()
  .required("Ticket Name is required")
  .min(3, "Ticket Name must be at least 3 characters long");

export const firstNameValidation = Yup.string()
  .required("First Name is required")
  .min(3, "First Name must be at least 3 characters long");

  export const helpValidation = Yup.string()
  .required("Help Name is required")
  .min(5, "Help must be at least 5 characters long");

export const lastNameValidation = Yup.string()
  .required("Last Name is required")
  .min(3, "Last Name must be at least 3 characters long");

export const emailValidation = Yup.string().required("Email is required");

export const passwordValidation = Yup.string().required("Password is required");

export const confirmPasswordValidation = Yup.string()
  .required("Confirm Password is required")
  .oneOf([Yup.ref("password"), null], "Passwords must match");

export const localContactNameValidation = Yup.string()
  .required("Local contact name is required")
  .min(3, "Local contact name must be at least 3 characters long");

export const mobileNumberValidation = Yup.string()
  .required("Mobile number is required")
  .matches(/^[6-9][0-9]{9}$/, "Mobile Number must start with 6-9 and be 10 digits")
  .length(10, "Mobile Number must be exactly 10 digits");

export const assignValidation = Yup.object().shape({
  assign: Yup.string().required("Assign is required"),
  // other validations...
});

export const ticketDescriptionValidation = Yup.string()
  .required("Ticket description is required")
  .min(5, "Ticket description must be at least 5 characters long");

export const sowDescriptionValidation = Yup.string()
  .required("SOW description is required")
  .min(5, "SOW description must be at least 5 characters long");

export const serviceValidation = Yup.string().required(
  "Service name is required"
);

export const servicesValidation = Yup.string().required("Services is required");

export const boqDetailsValidation = Yup.string()
  .required("BOQ details is required")
  .min(3, "BOQ details must be at least 3 characters long");

export const dateRangeValidation = Yup.array()
  .required("Date range is required")
  .of(
    Yup.string().test("is-valid-date", "Invalid date format", (value) =>
      moment(value, "DD-MM-YYYY HH:mm:ss", true).isValid()
    )
  )
  .test(
    "date-range",
    "End date must be later than start date",
    function (value) {
      const [startDate, endDate] = value;
      if (!startDate || !endDate) return true; // Skip validation if dates are empty
      return moment(endDate, "DD-MM-YYYY HH:mm:ss").isAfter(
        moment(startDate, "DD-MM-YYYY HH:mm:ss")
      );
    }
  );

export const siteNameValidation = Yup.string()
  .required("Site Name is required")
  .min(3, "Site Name must be at least 3 characters long");

export const legalCodeValidation = Yup.string().required(
  "Legal code is required"
);

export const siteAddressValidation = Yup.string().required(
  "Site Address is required"
);

export const companyNameValidation = Yup.string().required(
  "Company name is required"
);

export const gstNumberValidation = Yup.string().required(
  "GST Number is required"
);
// .matches(
//   /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
//   "Must be a valid GST number"
// );
//   15 characters long
// First 2 characters are the state code (numeric, from 01 to 35).
// Next 10 characters are the PAN number (5 letters followed by 4 numbers and 1 letter).
// 13th character is a business entity code (can be any digit or letter).
// 14th character is always "Z".
// 15th character is a checksum character (can be a digit or letter).

export const streetAddressValidation = Yup.string().required(
  "Street Address is required"
);

export const landMarkValidation = Yup.string().required("LandMark is required");

export const colonyNameValidation = Yup.string().required(
  "Colony name is required"
);

export const cityValidation = Yup.string().required("City is required");

export const stateValidation = Yup.string().required("State is required");

export const pincodeValidation = Yup.string()
  .matches(/^\d{6}$/, "Pincode must be 6 digits")
  .required("Pincode is required");

export const workingHoursValidation = Yup.number()
  .required("Please enter working hours")
  .positive("Must be a positive number");

export const startTimeValidation = Yup.string().required(
  "Please select start time"
);
