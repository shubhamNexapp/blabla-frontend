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
import { CSVLink } from "react-csv";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import jsPDF from "jspdf";
import "jspdf-autotable";

import { addInvoiceDetail, getInvoices as onGetInvoices, invoiceDelete, invoiceUpdate } from "../../store/actions";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import {
  InvoiceId,
  Date,
  BillingName,
  Amount,
  DownloadPdf
} from "./warehouselistCol";

//redux
import { useSelector, useDispatch } from "react-redux";
import { useFormik } from "formik";

import * as Yup from "yup";
import DeleteModal from "../Calendar/DeleteModal";
import moment from "moment";
import { createSelector } from "reselect";
import { Link } from "react-router-dom";

const WarehouseList = () => {

  document.title = "Warehouse List | ";

  const dispatch = useDispatch();

  const [modal, setModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [order, setOrder] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  // Redux selector for invoices
  const invoiceData = createSelector(
    (state) => state.invoices,
    (state) => ({
      invoices: state.invoices,
    })
  );

  const { invoices } = useSelector(invoiceData);

  // Form validation with Formik and Yup
  const validation = useFormik({
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
      const formattedDate = moment(values.date).format("DD MMM, YYYY");
      const updatedInvoice = {
        id: values.id || 0,
        Amount: values.Amount,
        founder: values.founder,
        date: formattedDate,
        invoiceId: values.invoiceId,
        status: values.status,
        color: values.color,
      };

      if (isEdit) {
        dispatch(invoiceUpdate(updatedInvoice));
      } else {
        const newInvoice = {
          ...updatedInvoice,
          id: Math.floor(Math.random() * (30 - 20)) + 20,
          color: "success",
        };
        dispatch(addInvoiceDetail(newInvoice));
      }
      validation.resetForm();
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
        Header: () => (
          <div className="form-check font-size-16">
            <input
              type="checkbox"
              className="form-check-input"
              onChange={handleSelectAll}
              checked={selectedRows.length === invoices.length}
            />
            <label className="form-check-label"></label>
          </div>
        ),
        Cell: ({ row }) => (
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
      {
        accessor: "founder",
        Header: "Warehouse Name",
        filterable: true,
        disableFilters: true,
        Cell: (cellProps) => <BillingName {...cellProps} />,
      },
      {
        accessor: "Location",
        Header: "Location",
        filterable: true,
        disableFilters: true,
        Cell: (cellProps) => <BillingName {...cellProps} />,
      },
      {
        accessor: "Amount",
        Header: "Contact Number",
        filterable: true,
        disableFilters: true,
        Cell: (cellProps) => <Amount {...cellProps} />,
      },
      {
        accessor: "Material",
        Header: "Material Name",
        filterable: true,
        disableFilters: true,
        Cell: (cellProps) => <Amount {...cellProps} />,
      },
      {
        accessor: "status",
        Header: "Material Quantity",
        filterable: true,
        disableFilters: true,
        Cell: (invoice) => (
          <div className={`badge bg-${invoice.row.original.color}-subtle text-${invoice.row.original.color} font-size-12`}>
            {invoice.row.original.status}
          </div>
        ),
      },
      {
        accessor: "downloadpdf",
        Header: "Download Pdf",
        filterable: true,
        disableFilters: true,
        Cell: (cellProps) => <DownloadPdf {...cellProps} />,
      },
      {
        id: "actions",
        Header: "Action",
        Cell: (cellProps) => (
          <UncontrolledDropdown>
            <DropdownToggle className="btn btn-link text-muted py-1 font-size-16 shadow-none" tag="a">
              <i className="bx bx-dots-horizontal-rounded"></i>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-end">
              <DropdownItem onClick={() => onUpdateData(cellProps.row.original)}>Edit</DropdownItem>
              <DropdownItem>
                <Link to="/invoices-detail" className="text-dark">
                  Print
                </Link>
              </DropdownItem>
              <DropdownItem onClick={() => onDeleteData(cellProps.row.original)}>Delete</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        ),
      },
    ],
    [selectedRows, invoices]
  );

  // Custom component to render each row in the table
  const CustomTableContainer = () => (
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
          <Breadcrumbs title="Warehouse" breadcrumbItem="Warehouse" />
          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <CustomTableContainer />
                </CardBody>
                <Modal isOpen={modal} toggle={toggle}>
                  <ModalHeader toggle={toggle}>
                    {isEdit ? "Edit Warehouse" : "Add Warehouse"}
                  </ModalHeader>
                  <ModalBody>
                    <Form
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
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
                              invalid={validation.touched.invoiceId && validation.errors.invoiceId}
                            />
                            {validation.touched.invoiceId && validation.errors.invoiceId && (
                              <FormFeedback type="invalid">
                                {validation.errors.invoiceId}
                              </FormFeedback>
                            )}
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
                              invalid={validation.touched.founder && validation.errors.founder}
                            />
                            {validation.touched.founder && validation.errors.founder && (
                              <FormFeedback type="invalid">
                                {validation.errors.founder}
                              </FormFeedback>
                            )}
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
                              invalid={validation.touched.Amount && validation.errors.Amount}
                            />
                            {validation.touched.Amount && validation.errors.Amount && (
                              <FormFeedback type="invalid">
                                {validation.errors.Amount}
                              </FormFeedback>
                            )}
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
                              invalid={validation.touched.status && validation.errors.status}
                            >
                              <option>Paid</option>
                              <option>Pending</option>
                            </Input>
                            {validation.touched.status && validation.errors.status && (
                              <FormFeedback type="invalid">
                                {validation.errors.status}
                              </FormFeedback>
                            )}
                          </div>

                          <div className="mb-3">
                            <Label className="form-label">Date</Label>
                            <Input
                              name="date"
                              type="date"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.date || ""}
                              invalid={validation.touched.date && validation.errors.date}
                            />
                            {validation.touched.date && validation.errors.date && (
                              <FormFeedback type="invalid">
                                {validation.errors.date}
                              </FormFeedback>
                            )}
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <div className="text-end">
                            <button type="submit" className="btn btn-success save-user">
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

export default WarehouseList;
