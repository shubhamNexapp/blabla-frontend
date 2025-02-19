import React, { useEffect, useMemo, useState } from "react";
import TableContainer from "../../components/Common/TableContainer";
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

import { addInvoiceDetail, getInvoices as onGetInvoices, invoiceDelete, invoiceUpdate } from "../../store/actions";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import {
  InvoiceId,
  Date,
  BillingName,
  Amount,
  DownloadPdf
} from "./inventorylistCol";

//redux
import { useSelector, useDispatch } from "react-redux";
import { useFormik } from "formik";

import * as Yup from "yup";
import DeleteModal from "../Calendar/DeleteModal";
import moment from "moment";
import { createSelector } from "reselect";
import { Link } from "react-router-dom";


const InventoryList = () => {

  //meta title
  document.title = "Inventory List | ";

  const dispatch = useDispatch();

  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [order, setOrder] = useState(null);

  // for delete invoice
  const [deleteModal, setDeleteModal] = useState(false);

  const invoiceData = createSelector(

    (state) => state.invoices,
    (state) => ({
      invoices: state.invoices,
    })
  );
  // Inside your component
  const { invoices } = useSelector(invoiceData);

  // validation
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

  useEffect(() => {
    dispatch(onGetInvoices());
  }, [dispatch]);

  const toggle = () => {
    if (modal) {
      setModal(false);
      setOrder(null);
    } else {
      setModal(true);
    }
  };

  const handleUserClicks = () => {
    setIsEdit(false);
    toggle();
  };

  const onDeleteData = (data) => {
    setDeleteModal(true);
    setOrder(data);
  };

  const handleDeleteInvoice = () => {
    if (order.id) {
      dispatch(invoiceDelete(order.id));
      setDeleteModal(false);
    }
  };

  const onUpdateData = (data) => {
    setOrder({
      id: data.id,
      Amount: data.Amount,
      color: data.color,
      date: moment(data.date).format("YYYY-MM-DD"),
      founder: data.founder,
      invoiceId: data.invoiceId,
      status: data.status,
    });

    setIsEdit(true);

    toggle();
  };

  const [selectedRows, setSelectedRows] = useState([]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(invoices.map(invoice => invoice.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const columns = useMemo(
    () => [
      {
        id: "selection",
        Header: "#",
        Cell: ({ row }) => {
          return (
            <div className="form-check font-size-16">
                <input 
                  type="checkbox" 
                  className="form-check-input" 
                  checked={selectedRows.includes(row.original.id)}
                  onChange={() => handleSelectRow(row.original.id)} 
                />
                <label className="form-check-label"></label>
            </div>
          )
        },
        Header: ({ getToggleAllRowsSelectedProps }) => {
          return (
            <div className="form-check font-size-16">
              <input
                type="checkbox"
                className="form-check-input"
                onChange={handleSelectAll}
                checked={selectedRows.length === invoices.length}
              />
              <label className="form-check-label"></label>
            </div>
          )
        }
      },
      {
        accessor: "founder",
        Header: "Serial Number",
        filterable: true,
        disableFilters: true,
        Cell: (cellProps) => {
          return <BillingName {...cellProps} />;
        },
      },
      {
        accessor: "Location",
        Header: "Service Name",
        filterable: true,
        disableFilters: true,
        Cell: (cellProps) => {
          return <BillingName {...cellProps} />;
        },
      },
      {
        accessor: "Amount",
        Header: "Engineer Name",
        filterable: true,
        disableFilters: true,
        Cell: (cellProps) => {
          return <Amount {...cellProps} />;
        },
      },
      {
        accessor: "Material",
        Header: "Location",
        filterable: true,
        disableFilters: true,
        Cell: (cellProps) => {
          return <Amount {...cellProps} />;
        },
      },
      // {
      //   accessor: "status",
      //   Header: "Material Quantity",
      //   filterable: true,
      //   disableFilters: true,
      //   Cell: (invoice) => {
      //     return (
      //       <div className={"badge bg-" + invoice.row.original.color + "-subtle text-" + invoice.row.original.color + " font-size-12"}>
      //         {invoice.row.original.status}
      //       </div>
      //     )
      //   },
      // },
      // {
      //   accessor: "downloadpdf",
      //   Header: "Download Pdf",
      //   filterable: true,
      //   disableFilters: true,
      //   Cell: (cellProps) => {
      //     return <DownloadPdf {...cellProps} />;
      //   },
      // },
      {
        id: "actions",
        Header: "Action",
        Cell: (cellProps) => {
          return (
            <UncontrolledDropdown>
              <DropdownToggle className="btn btn-link text-muted py-1 font-size-16 shadow-none" tag="a">
                <i className="bx bx-dots-horizontal-rounded"></i>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-end">
                <DropdownItem onClick={() => onUpdateData(cellProps.row.original)}>Edit</DropdownItem>
                <DropdownItem><Link to="/invoices-detail" className="text-dark">
                    Print
                  </Link></DropdownItem>
                <DropdownItem onClick={() => onDeleteData(cellProps.row.original)}>Delete</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          );
        },
      },
    ],
    [selectedRows, invoices]
  );

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteInvoice}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Inventory" breadcrumbItem="All Inventory" />
          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <TableContainer
                    columns={columns}
                    data={invoices}
                    isGlobalFilter={true}
                    isAddInvoiceList={true}
                    customPageSize={10}
                    handleInvoiceClick={handleUserClicks}
                    isAddInvoiceListIcon={true}
                    className="custom-header-css"
                  />
                </CardBody>
                <Modal
                  isOpen={modal}
                  toggle={toggle}
                >
                  <ModalHeader toggle={toggle} tag="h4">
                    {isEdit ? "Edit Inventory" : "Add Inventory"}
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
                          <Label className="form-label">Invoice ID</Label>
                          <div className="mb-3">
                            <Input
                              name="invoiceId"
                              type="text"
                              placeholder="Insert Invoice Id"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
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
                            <Label className="form-label">Billing Name</Label>
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
                              value={validation.values.Amount || ""}
                              invalid={
                                validation.touched.Amount &&
                                  validation.errors.Amount
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.Amount &&
                              validation.errors.Amount ? (
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
                                validation.touched.status &&
                                  validation.errors.status
                                  ? true
                                  : false
                              }
                            >
                              <option>Paid</option>
                              <option>Pending</option>
                            </Input>
                            {validation.touched.status &&
                              validation.errors.status ? (
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
                                validation.touched.date &&
                                  validation.errors.date
                                  ? true
                                  : false
                              }
                            ></Input>
                            {validation.touched.date &&
                              validation.errors.date ? (
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
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default InventoryList;
