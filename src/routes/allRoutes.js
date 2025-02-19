import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

//Dashboard
import Dashboard from "../pages/Dashboard/index";
import DashboardCompo from "../DashboardLayout/IndividualDashboard/DashboardCompo";

//Tickets
import Tickets from "../pages/Tickets/index";
import AddTickets from "../pages/Tickets/AddTickets";

import AddTicket from "../pages/Tickets/AddTicket";

// Site
import AllSite from "../DashboardLayout/CustomerDashboard/site/AllSite";
//Wallet,Invoices
import InvoiceList from "../pages/Wallet/invoices-list";

//Inventory

import InventoryList from "../pages/Inventory/inventory-list";

import Map from "../pages/Map/Map";

//Service
import Service from "../pages/Services/index";
// import AddService from "../pages/Services/AddService";

// Calendar
import Calendar from "../pages/Calendar/index";

//Chat
import Chat from "../pages/Chat/Chat";

//Email
import EmailInbox from "../pages/Email/email-inbox";
import EmailRead from "../pages/Email/email-read";

//Invoice
import InvoicesList from "../pages/Invoices/invoices-list";
import InvoiceDetail from "../pages/Invoices/invoices-detail";

//Contact
import ContactsGrid from "../pages/Contacts/contacts-grid";
import ContactsList from "../pages/Contacts/ContactList/contacts-list";
import ContactsProfile from "../pages/Contacts/ContactsProfile/contacts-profile";

//blog
import BlogGrid from "../pages/Blog/blogGrid";
import BlogList from "../pages/Blog/blogList";
import BlogDetails from "../pages/Blog/blogDetails";

//Utility
import PagesStarter from "../pages/Utility/StarterPage";
import PageMaintenance from "../pages/Utility/PageMaintenance";
import PagesComingsoon from "../pages/Utility/PageComingsoon";
import PageTimeline from "../pages/Utility/PageTimeline";
import PageFaqs from "../pages/Utility/PageFaqs";
import PagePricing from "../pages/Utility/PagePricing/index";
import Error404 from "../pages/Utility/Error404";
import Error500 from "../pages/Utility/Error500";

// Ui Components
import UiAlert from "../pages/UiElements/UiAlert";
import UiButton from "../pages/UiElements/UiButton";
import UiCard from "../pages/UiElements/UiCard";
import UiCarousel from "../pages/UiElements/UiCarousel";
import UiDropdowns from "../pages/UiElements/UiDropdowns";
import UiGrid from "../pages/UiElements/UiGrid";
import UiImages from "../pages/UiElements/UiImages";
import UiModal from "../pages/UiElements/UiModals";
import UiOffCanvas from "../pages/UiElements/UiOffCanvas";
import UiProgressbar from "../pages/UiElements/UiProgressbar";
import UiPlaceholders from "../pages/UiElements/UiPlaceholders";
import UiTabsAccordions from "../pages/UiElements/UiTabsAccordions";
import UiTypography from "../pages/UiElements/UiTypography";
import UiToasts from "../pages/UiElements/UiToast";
import UiVideo from "../pages/UiElements/UiVideo";
import UiGeneral from "../pages/UiElements/UiGeneral";
import UiColors from "../pages/UiElements/UiColors";
import UiUtilities from "../pages/UiElements/UiUtilities";

//Extended pages
import Lightbox from "../pages/Extended/Lightbox";
import SessionTimeout from "../pages/Extended/SessionTimeout";
import UiRating from "../pages/Extended/UiRating";
import Notifications from "../pages/Extended/Notifications";

//Forms
import FormElements from "../pages/Forms/FormElements/index";
import FormValidation from "../pages/Forms/FormValidation/";
import AdvancedPlugins from "../pages/Forms/AdvancedPlugins";
import FormEditors from "../pages/Forms/FormEditors";
import FormUpload from "../pages/Forms/FormUpload";
import FormWizard from "../pages/Forms/FormWizard";
import FormMask from "../pages/Forms/FormMask";

//Tables
import BasicTable from "../pages/Tables/BasicTables";
import DatatableTables from "../pages/Tables/DatatableTables";
import ResponsiveTables from "../pages/Tables/ResponsiveTables";
import EditableTables from "../pages/Tables/EditableTables";

//Charts
import Apexchart from "../pages/Charts/Apexcharts";
import EChart from "../pages/Charts/EChart";
import ChartjsChart from "../pages/Charts/ChartjsChart";

//Icons
import IconBoxicons from "../pages/Icons/IconBoxicons";
import IconMaterialdesign from "../pages/Icons/IconMaterialdesign";
import IconDripicons from "../pages/Icons/IconDripicons";
import IconFontawesomes from "../pages/Icons/Fontawesomes";

// Maps
import MapsGoogle from "../pages/Maps/MapsGoogle";
import MapsVector from "../pages/Maps/MapsVector";
import MapsLeaflet from "../pages/Maps/MapsLeaflet";

// Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import ForgetPwd from "../pages/Authentication/ForgetPassword";
import RegisterNumber from "../pages/Authentication/RegisterNumber";
import ResetPassword from "../pages/Authentication/ResetPassword";

// User Registration Details
import UserDetails from "../pages/Authentication/wizard/UserDetails";
import UserSelection from "../pages/Authentication/wizard/UserSelection";
import CustomerDetails from "../pages/Authentication/wizard/CustomerDetails";

//AuthenticationInner related pages
import PageLogin from "../pages/AuthenticationInner/PageLogin";
import PageRegister from "../pages/AuthenticationInner/PageRegister";
import RecoverPassword from "../pages/AuthenticationInner/RecoverPassword";
import LockScreen from "../pages/AuthenticationInner/LockScreen";
import ConfirmMail from "../pages/AuthenticationInner/ConfirmMail";
import EmailVerification from "../pages/AuthenticationInner/EmailVerification";
import TwoStepVerfication from "../pages/AuthenticationInner/TwoStepVerfication";
import AuthLogout from "../pages/AuthenticationInner/Logout";
import UserProfile from "../pages/Authentication/user-profile";
import RangeSlider from "../pages/Extended/RangeSlider/Index";
import CustomerList from "../pages/Customer/CustomerList";
import CustomerLists from "../pages/Customer/CustomerLists";
import AddCustomer from "../pages/Customer/AddCustomer";
import EditCustomer from "../pages/Customer/EditCustomer";
import ServicePartnerList from "../pages/ServicePartner/servicepartner-list";
import EditServicePartner from "../pages/ServicePartner/EditServicePartner";
import TeamList from "../pages/Team/team-list";
import WarehouseList from "../pages/Warehouse/warehouse-list";
import EditTicket from "../pages/Tickets/EditTicket";
import AddGroup from "../pages/Services/AddGroup";
import AddTeam from "../pages/Team/AddTeam";
import OtpCompo from "../pages/Authentication/OtpCompo";
import AllTickets from "../DashboardLayout/IndividualDashboard/Tickets/AllTickets";
import InvoicePage from "../pages/Invoices/InvoicePage";
import NewTicket from "../pages/Tickets/NewTicket";
import EditSite from "../DashboardLayout/CustomerDashboard/site/EditSite";
import AddSite from "../DashboardLayout/CustomerDashboard/site/AddSite";
import CompanyDashboard from "../DashboardLayout/CompanyDahbord/CompanyDashboard";
import CustomerDashboard from "../DashboardLayout/CustomerDashboard/CustomerDashboard";
import AllServices from "../pages/Services/serviceCompo/AllServices";
import AddService from "../pages/Services/serviceCompo/AddService";
import EditService from "../pages/Services/serviceCompo/EditService";
import InProgressTickets from "../pages/Tickets/InProgressTickets";
import ViewParticularTicket from "../pages/Tickets/ViewParticularTicket";
import AllServicePartner from "../pages/ServicePartner/AllServicePartner";
import AllCustomerList from "../pages/Customer/AllCustomerList";
import SingleCustomer from "../DashboardLayout/CustomerDashboard/details/SingleCustomer";
import TicketDetails from "../pages/Tickets/TicketDetails";
import IndividualTicketDetails from "../DashboardLayout/IndividualDashboard/Tickets/IndividualTicketDetails";
// import OptSend from "../pages/Authentication/OptSend";
import PrivateRoute from "./PrivateRoute";
import { getUserDetails } from "../common/utility";
import Payment from '../DashboardLayout/CustomerDashboard/Payment/index'
import AdminParticularCustomerInvoice from "../DashboardLayout/CustomerDashboard/details/AdminParticularCustomerInvoice";
import ServicePartnerDetails from "../pages/ServicePartner/ServicePartnerDetails";
import LandingPage from '../pages/LandingPage/index'
import AddHelp from "../pages/Help/AddHelp";
import AdminHelpList from "../pages/Help/AdminHelpList";
import AddHelpIndividual from "../pages/Help/AddHelpIndividual";
import TicketPaymentDetails from "../DashboardLayout/CustomerDashboard/Payment/TicketPaymentDetails";
import ISPRegistration from "../pages/Authentication/wizard/ISPRegistration";
import ISPDashboard from "../DashboardLayout/ISPDashboard/ISPDashboard";
import AccountDash from "../DashboardLayout/AccountDashbord/AccountDashInfo/AccountDash";
import AccountVendorPayment from "../DashboardLayout/AccountDashbord/AccountPayment/AccountVendorPayment";
import AddLocation from "../pages/AddLocation/AddLocation";
import AdminPayment from "../DashboardLayout/CustomerDashboard/Payment/AdminPayment";
import AdminTicketPaymentDetails from "../DashboardLayout/CustomerDashboard/Payment/AdminTicketPaymentDetails";

// const role = JSON.parse(localStorage.getItem("authUser"))?.role



function getRole() {
  const authUser = localStorage.getItem("authUser");
  if (authUser) {
    const user = JSON.parse(authUser);
    console.log('login user', user)
    return user?.role;
  }
  return null;
}


// Example usage
const role = getRole();



const userRoutes = [

  // /========= ACCOUNT
  { path: "/account/dashboard", component: <PrivateRoute element={<AccountDash />} allowedRoles={["account"]} /> },
  { path: "/account/payment", component: <PrivateRoute element={<AccountVendorPayment />} allowedRoles={["account"]} /> },



  //dashboard
  { path: "/admin/dashboard", component: <PrivateRoute element={<Dashboard />} allowedRoles={["admin"]} /> },

  { path: "/individual/dashboard", component: <PrivateRoute element={<DashboardCompo />} allowedRoles={["individual"]} /> },
  { path: "/company/dashboard", component: <PrivateRoute element={<CompanyDashboard />} allowedRoles={["company"]} /> },
  { path: "/customer/dashboard", component: <PrivateRoute element={<CustomerDashboard />} allowedRoles={["customer"]} /> },
  { path: "/isp/dashboard", component: <PrivateRoute element={<ISPDashboard />} allowedRoles={["isp"]} /> },


  //Tickets
  { path: "/admin/tickets", component: <PrivateRoute element={<Tickets />} allowedRoles={["admin"]} /> },
  { path: "/customer/tickets", component: <PrivateRoute element={<Tickets />} allowedRoles={["customer"]} /> },


  { path: "/customer/add-ticket", component: <PrivateRoute element={<AddTicket />} allowedRoles={["customer"]} /> },
  { path: "/admin/add-ticket", component: <PrivateRoute element={<AddTicket />} allowedRoles={["admin"]} /> },

  { path: "/individual/new-ticket-assign", component: <PrivateRoute element={<NewTicket />} allowedRoles={["individual"]} /> },
  { path: "/company/new-ticket-assign", component: <PrivateRoute element={<NewTicket />} allowedRoles={["company"]} /> },

  { path: "/individual/inprogress-ticket", component: <PrivateRoute element={<InProgressTickets />} allowedRoles={["individual"]} /> },
  { path: "/company/inprogress-ticket", component: <PrivateRoute element={<InProgressTickets />} allowedRoles={["company"]} /> },

  { path: "/company/particular-ticket/:id", component: <PrivateRoute element={<ViewParticularTicket />} allowedRoles={["company"]} /> },
  { path: "/individual/particular-ticket/:id", component: <PrivateRoute element={<ViewParticularTicket />} allowedRoles={["individual"]} /> },

  { path: "/customer/ticket-details/:id", component: <PrivateRoute element={<TicketDetails />} allowedRoles={["customer"]} /> },
  { path: "/admin/ticket-details/:id", component: <PrivateRoute element={<TicketDetails />} allowedRoles={["admin"]} /> },
  { path: "/account/ticket-details/:id", component: <PrivateRoute element={<TicketDetails />} allowedRoles={["account"]} /> },

  { path: "/customer/edit-ticket/:id", component: <PrivateRoute element={<EditTicket />} allowedRoles={["customer"]} /> },
  { path: "/admin/edit-ticket/:id", component: <PrivateRoute element={<EditTicket />} allowedRoles={["admin"]} /> },

  { path: "/company/tickets", component: <PrivateRoute element={<AllTickets />} allowedRoles={["company"]} /> },
  { path: "/individual/tickets", component: <PrivateRoute element={<AllTickets />} allowedRoles={["individual"]} /> },


  // Single Tickets

  { path: "/company/single-ticket/:id", component: <PrivateRoute element={<IndividualTicketDetails />} allowedRoles={["company"]} /> },
  { path: "/individual/single-ticket/:id", component: <PrivateRoute element={<IndividualTicketDetails />} allowedRoles={["individual"]} /> },
  // { path: "/customer/single-ticket/:id", component: <IndividualTicketDetails /> },
  { path: "/admin/single-ticket/:id", component: <PrivateRoute element={<IndividualTicketDetails />} allowedRoles={["admin"]} /> },




  // Add Tickets
  role == "customer" && {
    path: "/add-ticket",
    exact: true,
    component: <Navigate to="/customer/add-ticket" />,
  },
  role == "admin" && {
    path: "/add-tickets",
    exact: true,
    component: <Navigate to="/admin/add-ticket" />,
  },





  // Site
  { path: "/customer/allsite", component: <PrivateRoute element={<AllSite />} allowedRoles={["customer"]} /> },
  { path: "/customer/add-site", component: <PrivateRoute element={<AddSite />} allowedRoles={["customer"]} /> },
  { path: "/customer/update-site/:id", component: <PrivateRoute element={<EditSite />} allowedRoles={["customer"]} /> },
  { path: "/admin/update-site/:id", component: <PrivateRoute element={<EditSite />} allowedRoles={["admin"]} /> },

  //Service
  // { path: "/service", component: <Service /> },
  // { path: "/add-service", component: <AddService /> },
  // { path: "/add-service-group", component: <AddGroup /> },

  { path: "/admin/service", component: <PrivateRoute element={<AllServices />} allowedRoles={["admin"]} /> },
  { path: "/admin/add-service", component: <PrivateRoute element={<AddService />} allowedRoles={["admin"]} /> },
  { path: "/admin/update-service/:id", component: <PrivateRoute element={<EditService />} allowedRoles={["admin"]} /> },

  //Customer
  { path: "/admin/customer", component: <PrivateRoute element={<AllCustomerList />} allowedRoles={["admin"]} /> },
  { path: "/admin/add-customer", component: <PrivateRoute element={<AddCustomer />} allowedRoles={["admin"]} /> },
  { path: "/admin/particular-customer", component: <PrivateRoute element={<SingleCustomer />} allowedRoles={["admin"]} /> },
  // add-customer
  { path: "/admin/edit-customer/:id", component: <PrivateRoute element={<EditCustomer />} allowedRoles={["admin"]} /> },

  //Service Partner
  // { path: "/service-partner", component: <ServicePartnerList /> },
  { path: "/admin/service-partner", component: <PrivateRoute element={<AllServicePartner />} allowedRoles={["admin"]} /> },
  { path: "/admin/service-partner-detail/:id", component: <PrivateRoute element={<ServicePartnerDetails />} allowedRoles={["admin"]} /> },

  { path: "/admin/edit-service/:id", component: <PrivateRoute element={<EditServicePartner />} allowedRoles={["admin"]} /> },
  //Team
  { path: "/team", component: <TeamList /> },
  { path: "/add-team", component: <AddTeam /> },

  //Warehouse
  { path: "/warehouse", component: <WarehouseList /> },

  //Wallet,Invoices
  { path: "/invoices-list", component: <InvoiceList /> },

  //Team
  { path: "/customer/map", component: <PrivateRoute element={<Map />} allowedRoles={["customer"]} /> },
  { path: "/admin/map", component: <PrivateRoute element={<Map />} allowedRoles={["admin"]} /> },

  //profile

  { path: "/customer/profile", component: <PrivateRoute element={<UserProfile />} allowedRoles={["customer"]} /> },
  { path: "/admin/profile", component: <PrivateRoute element={<UserProfile />} allowedRoles={["admin"]} /> },
  { path: "/company/profile", component: <PrivateRoute element={<UserProfile />} allowedRoles={["company"]} /> },
  { path: "/individual/profile", component: <PrivateRoute element={<UserProfile />} allowedRoles={["individual"]} /> },

  // Payment

  { path: "/customer/payment", component: <PrivateRoute element={<Payment />} allowedRoles={["customer"]} /> },
  { path: "/admin/payment", component: <PrivateRoute element={<AdminPayment />} allowedRoles={["admin"]} /> },
  { path: "/admin/customer-payment", component: <PrivateRoute element={<AdminParticularCustomerInvoice />} allowedRoles={["admin"]} /> },
  { path: "/company/payment", component: <PrivateRoute element={<Payment />} allowedRoles={["company"]} /> },
  { path: "/individual/payment", component: <PrivateRoute element={<Payment />} allowedRoles={["individual"]} /> },
  { path: "/admin/ticket-payment-details/:id", component: <PrivateRoute element={<AdminTicketPaymentDetails />} allowedRoles={["admin"]} /> },
  { path: "/customer/ticket-payment-details/:id", component: <PrivateRoute element={<TicketPaymentDetails />} allowedRoles={["customer"]} /> },

  // Help

  { path: "/customer/add-help", component: <PrivateRoute element={<AddHelp />} allowedRoles={["customer"]} /> },
  { path: "/individual/add-help", component: <PrivateRoute element={<AddHelpIndividual />} allowedRoles={["individual"]} /> },
  { path: "/company/add-help", component: <PrivateRoute element={<AddHelpIndividual />} allowedRoles={["company"]} /> },
  { path: "/admin/help-list", component: <PrivateRoute element={<AdminHelpList />} allowedRoles={["admin"]} /> },

  { path: "/company/add-location", component: <PrivateRoute element={<AddLocation />} allowedRoles={["company"]} /> },
  { path: "/individual/add-location", component: <PrivateRoute element={<AddLocation />} allowedRoles={["individual"]} /> },

  //Calendar
  { path: "/apps-calendar", component: <Calendar /> },

  //Chat
  { path: "/apps-chat", component: <Chat /> },

  //Email
  { path: "/email-inbox", component: <EmailInbox /> },
  { path: "/email-read", component: <EmailRead /> },

  //Invoice
  { path: "/invoices-list", component: <InvoicesList /> },
  { path: "/invoices-detail", component: <InvoiceDetail /> },

  //Inventory
  { path: "/all-inventory", component: <InventoryList /> },

  // this route should be at the end of all other routes
  role == "company" && {
    path: "/",
    exact: true,
    component: <Navigate to="/company/dashboard" />,
  },
  role == "individual" && {
    path: "/",
    exact: true,
    component: <Navigate to="/individual/dashboard" />,
  },
  role == "customer" && {
    path: "/",
    exact: true,
    component: <Navigate to="/customer/dashboard" />,
  },
  role == "admin" && {
    path: "/",
    exact: true,
    component: <Navigate to="/admin/dashboard" />,
  },

  { path: "/", exact: true, component: <Navigate to="/homepage" /> },

  // Invoices
  { path: "/invoice-page", component: <InvoicePage /> },
  { path: "/unauthorized", component: <Error404 /> },
];

const authRoutes = [
  //authencation page
  { path: "/homepage", component: <LandingPage /> },
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPwd /> },
  { path: "/register", component: <Register /> },
  { path: "/register-number", component: <RegisterNumber /> },
  { path: "/reset-password/:id", component: <ResetPassword /> },

  // User Details Page
  { path: "/registration-details", component: <UserDetails /> },
  { path: "/registration-selection", component: <UserSelection /> },
  { path: "/customer-registration-details", component: <CustomerDetails /> },
  { path: "/isp-registration-details", component: <ISPRegistration /> },

  //AuthenticationInner pages
  { path: "/page-login", component: <PageLogin /> },
  { path: "/page-register", component: <PageRegister /> },
  { path: "/page-recoverpw", component: <RecoverPassword /> },
  { path: "/page-lock-screen", component: <LockScreen /> },
  { path: "/page-confirm-mail", component: <ConfirmMail /> },
  { path: "/page-email-verification", component: <EmailVerification /> },
  { path: "/page-two-step-verification", component: <TwoStepVerfication /> },
  { path: "/page-logout", component: <AuthLogout /> },

  //Utility page
  { path: "/pages-maintenance", component: <PageMaintenance /> },
  { path: "/pages-comingsoon", component: <PagesComingsoon /> },
  { path: "/pages-404", component: <Error404 /> },

  { path: "/pages-500", component: <Error500 /> },
];

export { userRoutes, authRoutes };

// //Contact
// { path: "/contacts-grid", component: <ContactsGrid /> },
// { path: "/contacts-list", component: <ContactsList /> },
// { path: "/contacts-profile", component: <ContactsProfile /> },

// //blog
// { path: "/blog-grid", component: <BlogGrid /> },
// { path: "/blog-list", component: <BlogList /> },
// { path: "/blog-details", component: <BlogDetails /> },

// //Utility
// { path: "/pages-starter", component: <PagesStarter /> },
// { path: "/pages-timeline", component: <PageTimeline /> },
// { path: "/pages-faqs", component: <PageFaqs /> },
// { path: "/pages-pricing", component: <PagePricing /> },

// //Components
// { path: "/ui-alerts", component: <UiAlert /> },
// { path: "/ui-buttons", component: <UiButton /> },
// { path: "/ui-cards", component: <UiCard /> },
// { path: "/ui-carousel", component: <UiCarousel /> },
// { path: "/ui-dropdowns", component: <UiDropdowns /> },
// { path: "/ui-grid", component: <UiGrid /> },
// { path: "/ui-images", component: <UiImages /> },
// { path: "/ui-modals", component: <UiModal /> },
// { path: "/ui-offcanvas", component: <UiOffCanvas /> },
// { path: "/ui-progressbars", component: <UiProgressbar /> },
// { path: "/ui-placeholders", component: <UiPlaceholders /> },
// { path: "/ui-tabs-accordions", component: <UiTabsAccordions /> },
// { path: "/ui-typography", component: <UiTypography /> },
// { path: "/ui-toasts", component: <UiToasts /> },
// { path: "/ui-video", component: <UiVideo /> },
// { path: "/ui-general", component: <UiGeneral /> },
// { path: "/ui-colors", component: <UiColors /> },
// { path: "/ui-utilities", component: <UiUtilities /> },

// //Extended pages
// { path: "/extended-lightbox", component: <Lightbox /> },
// { path: "/extended-rangeslider", component: <RangeSlider /> },
// { path: "/extended-session-timeout", component: <SessionTimeout /> },
// { path: "/extended-rating", component: <UiRating /> },
// { path: "/extended-notifications", component: <Notifications /> },

// //Forms
// { path: "/form-elements", component: <FormElements /> },
// { path: "/form-validation", component: <FormValidation /> },
// { path: "/form-advanced", component: <AdvancedPlugins /> },
// { path: "/form-editors", component: <FormEditors /> },
// { path: "/form-uploads", component: <FormUpload /> },
// { path: "/form-wizard", component: <FormWizard /> },
// { path: "/form-mask", component: <FormMask /> },

// //tables
// { path: "/tables-basic", component: <BasicTable /> },
// { path: "/tables-datatable", component: <DatatableTables /> },
// { path: "/tables-responsive", component: <ResponsiveTables /> },
// { path: "/tables-editable", component: <EditableTables /> },

// //Charts
// { path: "/charts-apex", component: <Apexchart /> },
// { path: "/charts-echart", component: <EChart /> },
// { path: "/charts-chartjs", component: <ChartjsChart /> },

// //Icons
// { path: "/icons-boxicons", component: <IconBoxicons /> },
// { path: "/icons-materialdesign", component: <IconMaterialdesign /> },
// { path: "/icons-dripicons", component: <IconDripicons /> },
// { path: "/icons-fontawesome", component: <IconFontawesomes /> },

// // Maps
// { path: "/maps-google", component: <MapsGoogle /> },
// { path: "/maps-vector", component: <MapsVector /> },
// { path: "/maps-leaflet", component: <MapsLeaflet /> },
