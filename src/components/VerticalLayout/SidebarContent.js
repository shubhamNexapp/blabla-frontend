import PropTypes from "prop-types";
import React, { useEffect, useRef, useCallback } from "react";
import * as Yup from "yup";
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  Label,
  Input,
  FormFeedback,
} from "reactstrap";

//Import Icons
import FeatherIcon from "feather-icons-react";

//Import images
import giftBox from "../../assets/images/giftbox.png";

// //Import Scrollbar
import SimpleBar from "simplebar-react";

// MetisMenu
import MetisMenu from "metismenujs";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import withRouter from "../Common/withRouter";
import { useFormik } from "formik";

//i18n
import { withTranslation } from "react-i18next";

const SidebarContent = (props) => {
  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [order, setOrder] = useState(null);

  const navigate = useNavigate();
  function getRole() {
    const authUser = localStorage.getItem("authUser");

    if (authUser) {
      const user = JSON.parse(authUser);
      return user.role;
    }

    return null;
  }

  // Example usage
  const role = getRole();
  // console.log(role);

  const handleRedirect = (e, path) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(path);
  };
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      Amount: (order && order.Amount) || "",
      date: (order && order.date) || "",
      founder: (order && order.founder) || "",
      id: (order && order.id) || "",
      invoiceId: (order && order.invoiceId) || "",
      status: (order && order.status) || "Paid",
      color: (order && order.color) || "Success",
    },
    validationSchema: Yup.object({
      Amount: Yup.string().required("Please Enter Amount"),
      founder: Yup.string().required("Please Enter Billing Name"),
      invoiceId: Yup.string().required("Please Enter Invoice Id"),
      status: Yup.string().required("Please Enter Status"),
      date: Yup.date().required("Please Enter Date"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updateUser = {
          id: values.id ? values.id : 0,
          Amount: values.Amount,
          founder: values.founder,
          date: moment(values.date).format("DD MMM , YYYY"),
          invoiceId: values.invoiceId,
          status: values.status,
          color: values.color,
        };

        // update user
        dispatch(invoiceUpdate(updateUser));
        validation.resetForm();
        // setIsEdit(false);
      } else {
        const invoice = {
          id: Math.floor(Math.random() * (30 - 20)) + 20,
          Amount: values["Amount"],
          founder: values["founder"],
          date: moment(values["date"]).format("DD MMM, YYYY"),
          invoiceId: values["invoiceId"],
          status: values["status"],
          color: "success",
        };
        // save new user
        dispatch(addInvoiceDetail(invoice));
        validation.resetForm();
      }
      toggle();
    },
  });

  const toggle = () => {
    if (modal) {
      setModal(false);
      setOrder(null);
    } else {
      setModal(true);
    }
  };

  const ref = useRef();
  const activateParentDropdown = useCallback((item) => {
    item.classList.add("active");
    const parent = item.parentElement;
    const parent2El = parent.childNodes[1];

    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show");
    }

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show"); // ul tag

        const parent3 = parent2.parentElement; // li tag

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement; // ul
          if (parent4) {
            parent4.classList.add("mm-show"); // ul
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add("mm-show"); // li
              parent5.childNodes[0].classList.add("mm-active"); // a tag
            }
          }
        }
      }
      scrollElement(item);
      return false;
    }
    scrollElement(item);
    return false;
  }, []);

  const removeActivation = (items) => {
    for (var i = 0; i < items.length; ++i) {
      var item = items[i];
      const parent = items[i].parentElement;

      if (item && item.classList.contains("active")) {
        item.classList.remove("active");
      }
      if (parent) {
        const parent2El =
          parent.childNodes && parent.childNodes.lenght && parent.childNodes[1]
            ? parent.childNodes[1]
            : null;
        if (parent2El && parent2El.id !== "side-menu") {
          parent2El.classList.remove("mm-show");
        }

        parent.classList.remove("mm-active");
        const parent2 = parent.parentElement;

        if (parent2) {
          parent2.classList.remove("mm-show");

          const parent3 = parent2.parentElement;
          if (parent3) {
            parent3.classList.remove("mm-active"); // li
            parent3.childNodes[0].classList.remove("mm-active");

            const parent4 = parent3.parentElement; // ul
            if (parent4) {
              parent4.classList.remove("mm-show"); // ul
              const parent5 = parent4.parentElement;
              if (parent5) {
                parent5.classList.remove("mm-show"); // li
                parent5.childNodes[0].classList.remove("mm-active"); // a tag
              }
            }
          }
        }
      }
    }
  };

  const path = useLocation();
  const activeMenu = useCallback(() => {
    const pathName = path.pathname;
    let matchingMenuItem = null;
    const ul = document.getElementById("side-menu");
    const items = ul.getElementsByTagName("a");
    removeActivation(items);

    for (let i = 0; i < items.length; ++i) {
      if (pathName === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem);
    }
  }, [path.pathname, activateParentDropdown]);

  useEffect(() => {
    ref.current.recalculate();
  }, []);

  useEffect(() => {
    new MetisMenu("#side-menu");
    activeMenu();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    activeMenu();
  }, [activeMenu]);

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  }

  return (
    <React.Fragment>
      <SimpleBar style={{ maxHeight: "100%" }} ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            {/* <li className="menu-title">{props.t("Menu")} </li> */}

            {role === "individual" && (
              <>
                <li>
                  <Link to="/individual/dashboard" className="">
                    <FeatherIcon icon="home" />{" "}
                    <span>{props.t("Dashboard")}</span>
                  </Link>
                </li>

                <li>
                  <Link to="/#" className="has-arrow ">
                    <i className="mdi mdi-18px mdi-ticket-percent"></i>{" "}
                    <span>{props.t("Tickets")}</span>
                  </Link>

                  <ul className="sub-menu">
                    <li>
                      <Link to="/individual/tickets">
                        {props.t("All Tickets")}
                      </Link>
                    </li>
                    <li>
                      <Link to="/individual/new-ticket-assign">
                        {props.t("New Tickets")}
                      </Link>
                    </li>
                    <li>
                      <Link to="/individual/inprogress-ticket">
                        {props.t("In Progress Tickets")}
                      </Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link to="/individual/payment" className="">
                    {/* <FeatherIcon icon="dollar-sign" />{" "} */}
                    {/* <i className="bx bx-rupee"></i> */}
                    <i className=" fas fa-rupee-sign"></i>

                    {/* bx bx-rupee */}
                    <span>{props.t("Payment")}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/individual/add-location" className="">
                    <FeatherIcon icon="plus-circle" />
                    <span>{props.t("Add Location")}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/individual/add-help" className="">
                    <FeatherIcon icon="help-circle" />{" "}
                    <span>{props.t("Help")}</span>
                  </Link>
                </li>
              </>
            )}

            {role === "company" && (
              <>
                <li>
                  <Link to="/company/dashboard" className="">
                    <FeatherIcon icon="home" />{" "}
                    <span>{props.t("Dashboard")}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/#" className="has-arrow ">
                    <i className="mdi mdi-18px mdi-ticket-percent"></i>{" "}
                    <span>{props.t("Tickets")}</span>
                  </Link>

                  <ul className="sub-menu">
                    <li>
                      <Link to="/company/tickets">
                        {props.t("All Tickets")}
                      </Link>
                    </li>
                    <li>
                      <Link to="/company/new-ticket-assign">
                        {props.t("New Tickets")}
                      </Link>
                    </li>
                    <li>
                      <Link to="/company/inprogress-ticket">
                        {props.t("In Progress Tickets")}
                      </Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <Link to="/company/payment" className="">
                    {/* <FeatherIcon icon="dollar-sign" />{" "} */}
                    {/* <i className="bx bx-rupee"></i> */}
                    <i className=" fas fa-rupee-sign"></i>

                    <span>{props.t("Payment")}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/company/add-location" className="">
                    <FeatherIcon icon="plus-circle" />
                    <span>{props.t("Add Location")}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/company/add-help" className="">
                    <FeatherIcon icon="help-circle" />{" "}
                    <span>{props.t("Help")}</span>
                  </Link>
                </li>
              </>
            )}

            {role === "customer" && (
              <>
                <li>
                  <Link to="/customer/dashboard" className="">
                    <FeatherIcon icon="home" />{" "}
                    <span>{props.t("Dashboard")}</span>
                  </Link>
                </li>

                <li>
                  <Link to="/customer/tickets" className="has-arro">
                    <i className="mdi mdi-18px mdi-ticket-percent"></i>{" "}
                    <span>{props.t("Tickets")}</span>
                    <span
                      onClick={(e) => handleRedirect(e, "/customer/add-ticket")}
                      className="add-icon"
                      style={{ cursor: "pointer" }}
                    >
                      <FeatherIcon icon="plus-circle" />
                    </span>
                  </Link>
                </li>

                <li>
                  <Link to="/customer/allsite" className="has-arro">
                    <i className="mdi mdi-18px mdi-sitemap-outline"></i>{" "}
                    <span>{props.t("Sites")}</span>
                    <span
                      onClick={(e) => handleRedirect(e, "/customer/add-site")}
                      className="add-icon"
                      style={{ cursor: "pointer" }}
                    >
                      <FeatherIcon icon="plus-circle" />
                    </span>
                  </Link>
                </li>

                <li>
                  <Link to="/customer/map" className="has-arow ">
                    <i className="mdi mdi-18px mdi-map-legend"></i>{" "}
                    <span>{props.t("Map")}</span>
                  </Link>
                </li>

                <li>
                  <Link to="/customer/payment" className="">
                    {/* <FeatherIcon icon="dollar-sign" />{" "} */}
                    {/* <i className="bx bx-rupee"></i> */}
                    <i className=" fas fa-rupee-sign"></i>

                    {/* <i className=" fas fa-rupee-sign"></i> */}
                    <span>{props.t("Payment")}</span>
                  </Link>
                </li>

                <li>
                  <Link to="/customer/add-help" className="">
                    <FeatherIcon icon="help-circle" />{" "}
                    <span>{props.t("Help")}</span>
                  </Link>
                </li>
              </>
            )}

            {role === "isp" && (
              <>
                <li>
                  <Link to="/isp/dashboard" className="">
                    <FeatherIcon icon="home" />{" "}
                    <span>{props.t("Dashboard")}</span>
                  </Link>
                </li>
              </>
            )}

            {role === "admin" && (
              <>
                <li>
                  <Link to="/admin/dashboard" className="">
                    <FeatherIcon icon="home" />{" "}
                    <span>{props.t("Dashboard")}</span>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/admin/tickets"
                    //  className="has-arro"
                  >
                    <i className="mdi mdi-18px mdi-ticket-percent"></i>{" "}
                    <span>{props.t("Tickets")}</span>
                    {/* <span
                      onClick={(e) => handleRedirect(e, "/admin/add-ticket")}
                      className="add-icon"
                      style={{ cursor: "pointer" }}
                    >
                      <FeatherIcon icon="plus-circle" />
                    </span> */}
                  </Link>
                </li>
                {/* <li>
                  <Link to="/allsite" className="has-arro">
                    <i className="mdi mdi-18px mdi-sitemap-outline"></i>{" "}
                    <span>{props.t("Sites")}</span>
                    <span
                      onClick={(e) => handleRedirect(e, "/add-site")}
                      className="add-icon"
                      style={{ cursor: "pointer" }}
                    >
                      <FeatherIcon icon="plus-circle" />
                    </span>
                  </Link>
                </li> */}

                <li>
                  <Link to="/admin/service" className="has-arro">
                    <FeatherIcon icon="settings" />
                    <span>{props.t("Services")}</span>
                    <span
                      onClick={(e) => handleRedirect(e, "/admin/add-service")}
                      className="add-icon"
                      style={{ cursor: "pointer" }}
                    >
                      <FeatherIcon icon="plus-circle" />
                    </span>
                  </Link>
                </li>

                <li>
                  <Link to="/admin/customer" className="has-arro">
                    <FeatherIcon icon="user" />{" "}
                    <span>{props.t("Customer")}</span>
                    <span
                      onClick={(e) => handleRedirect(e, "/admin/add-customer")}
                      className="add-icon"
                      style={{ cursor: "pointer" }}
                    >
                      <FeatherIcon icon="plus-circle" />
                    </span>
                  </Link>
                </li>

                <li>
                  <Link to="/admin/service-partner" className=" ">
                    <i className="fas fa-handshake"></i>{" "}
                    <span>{props.t("Service Partner")}</span>
                  </Link>

                  {/* <ul className="sub-menu">
                    <li>
                      <Link to="/admin/service-partner">
                        {props.t("Service Partner List")}
                      </Link>
                    </li>
                  </ul> */}
                </li>

                {/* <li>
                  <Link to="/admin/rating" className="has-arow ">
                    <FeatherIcon icon="activity" />
                    <span>{props.t("Rating")}</span>
                  </Link>
                </li> */}
                {/* <li>
                  <Link to="/admin/payment" className="">
                    <FeatherIcon icon="dollar-sign" />{" "}
                    <span>{props.t("Payment")}</span>
                  </Link>
                </li> */}
                <li>
                  <Link to="/admin/map" className="has-arow ">
                    <i className="mdi mdi-18px mdi-map-legend"></i>{" "}
                    <span>{props.t("Map")}</span>
                  </Link>
                </li>

                <li>
                  <Link to="/admin/payment" className="has-arro">
                    {/* <FeatherIcon icon="dollar-sign" />{" "} */}
                    {/* <i className="bx bx-rupee"></i>
                     */}
                    <i className=" fas fa-rupee-sign"></i>

                    <span>{props.t("Payment")}</span>
                    {/* <span
                      // onClick={(e) => handleRedirect(e, "/admin/add-customer")}
                      className="add-icon"
                      style={{ cursor: "pointer" }}
                    >
                      <FeatherIcon icon="plus-circle" />
                    </span> */}
                  </Link>
                </li>

                <li>
                  <Link to="/admin/help-list" className="has-arro">
                    <FeatherIcon icon="help-circle" />{" "}
                    <span>{props.t("Help")}</span>
                  </Link>
                </li>

                {/* <li>
                  <Link to="/#" className="has-arrow ">
                    <FeatherIcon icon="users" /> <span>{props.t("Team")}</span>
                  </Link>

                  <ul className="sub-menu">
                    <li>
                      <Link to="/team">{props.t("Team Member List")}</Link>
                    </li>
                    <li>
                      <Link to="/add-team">
                        {props.t("Add new Team member")}
                      </Link>
                    </li>
                  </ul>
                </li>

                <li>
                  <Link to="/#" className="has-arrow ">
                    <i className="mdi mdi-18px mdi-hammer-screwdriver"></i>{" "}
                    <span>{props.t("Service")}</span>
                  </Link>

                  <ul className="sub-menu">
                    <li>
                      <Link to="/service">{props.t("Services")}</Link>
                    </li>
                    <li>
                      <Link to="/add-service">{props.t("Add Services")}</Link>
                    </li>
                    <li>
                      <Link to="/add-service-group">
                        {props.t("Add Group")}
                      </Link>
                    </li>
                  </ul>
                </li>

                <li className="menu-title">{props.t("Projects")}</li>

                <li>
                  <Link to="/#" className="has-arrow ">
                    <FeatherIcon icon="trello" />{" "}
                    <span>{props.t("Projects")}</span>
                  </Link>

                  <ul className="sub-menu">
                    <li>
                      <Link to="/charts-apex">{props.t("Project List")}</Link>
                    </li>
                    <li>
                      <Link to="/charts-echart">{props.t("Categories")}</Link>
                    </li>
                    
                  </ul>
                </li>

                <li>
                  <Link to="/#" className="has-arrow ">
                    <FeatherIcon icon="layers" />{" "}
                    <span>{props.t("Inventory")}</span>
                  </Link>

                  <ul className="sub-menu">
                    <li>
                      <Link to="/all-inventory">
                        {props.t("All Inventory")}
                      </Link>
                    </li>
                    <li>
                      <Link to="/charts-echart">{props.t("Categories")}</Link>
                    </li>
                   
                  </ul>
                </li>
                <li>
                  <Link to="/#" className="has-arrow ">
                    <i className="mdi mdi-18px mdi-warehouse"></i>{" "}
                    <span>{props.t("Warehouse")}</span>
                  </Link>

                  <ul className="sub-menu">
                    <li>
                      <Link to="/warehouse">{props.t("Warehouse List")}</Link>
                    </li>
                    <li>
                      <Link to="/charts-echart">{props.t("Categories")}</Link>
                    </li>
                    
                  </ul>
                </li> */}

                {/* <li>
                  <Link to="/#" className="has-arrow ">
                    <i className="mdi mdi-18px mdi-wallet"></i>{" "}
                    <span>{props.t("Wallet")}</span>
                  </Link>

                  <ul className="sub-menu">
                   
                    <li>
                      <Link to="/invoices-list">
                        {props.t("Invoicing and billing settings")}
                      </Link>
                    </li>
                    <li>
                      <Link to="/charts-echart">
                        {props.t("Tax settings ")}
                      </Link>
                    </li>
                  </ul>
                </li> */}
              </>
            )}

            {role === "account" && (
              <>
                <li>
                  <Link to="/account/dashboard" className="">
                    <FeatherIcon icon="home" />{" "}
                    <span>{props.t("Dashboard")}</span>
                  </Link>
                </li>
                <li>
                  <Link to="/account/payment" className="">
                    <FeatherIcon icon="home" />{" "}
                    <span>{props.t("Payment")}</span>
                  </Link>
                </li>
              </>
            )}
          </ul>

          <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle} tag="h4">
              {isEdit ? "Edit Ticket" : "Add Ticket"}
            </ModalHeader>
            <ModalBody>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  validation.handleSubmit();
                  return false;
                }}
              >
                <Row>
                  <Col xs={12}>
                    <Label className="form-label">Ticket ID</Label>
                    <div className="mb-3">
                      <Input
                        name="invoiceId"
                        type="text"
                        placeholder="INSTA0124"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        readonly="readonly"
                        value={validation.values.invoiceId || ""}
                        invalid={
                          validation.touched.invoiceId &&
                          validation.errors.invoiceId
                            ? true
                            : false
                        }
                      />
                      {validation.touched.invoiceId &&
                      validation.errors.invoiceId ? (
                        <FormFeedback type="invalid">
                          {validation.errors.invoiceId}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label className="form-label">Ticket Description</Label>
                      <Input
                        name="founder"
                        type="text"
                        placeholder="Insert Billing Name"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.founder || ""}
                        invalid={
                          validation.touched.founder &&
                          validation.errors.founder
                            ? true
                            : false
                        }
                      />
                      {validation.touched.founder &&
                      validation.errors.founder ? (
                        <FormFeedback type="invalid">
                          {validation.errors.founder}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label className="form-label">Amount</Label>
                      <Input
                        name="Amount"
                        type="text"
                        placeholder="Insert Amount"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                      />
                      {validation.touched.Amount && validation.errors.Amount ? (
                        <FormFeedback type="invalid">
                          {validation.errors.Amount}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div className="mb-3">
                      <Label className="form-label">Status</Label>
                      <Input
                        name="status"
                        type="select"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        multiple={false}
                        className="form-select"
                        value={validation.values.status || ""}
                        invalid={
                          validation.touched.status && validation.errors.status
                            ? true
                            : false
                        }
                      >
                        <option>Paid</option>
                        <option>Pending</option>
                      </Input>
                      {validation.touched.status && validation.errors.status ? (
                        <FormFeedback type="invalid">
                          {validation.errors.status}
                        </FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label className="form-label">Date</Label>
                      <Input
                        name="date"
                        type="date"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.date || ""}
                        invalid={
                          validation.touched.date && validation.errors.date
                            ? true
                            : false
                        }
                      ></Input>
                      {validation.touched.date && validation.errors.date ? (
                        <FormFeedback type="invalid">
                          {validation.errors.date}
                        </FormFeedback>
                      ) : null}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="text-end">
                      <button
                        type="submit"
                        className="btn btn-success save-user"
                      >
                        Save
                      </button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </ModalBody>
          </Modal>
        </div>
      </SimpleBar>
    </React.Fragment>
  );
};

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(SidebarContent));
