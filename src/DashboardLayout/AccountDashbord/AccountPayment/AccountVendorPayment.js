import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Link } from "react-router-dom";
import {
  Table,
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Pagination,
  PaginationItem,
  PaginationLink,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Breadcrumbs from "../../../components/Common/Breadcrumb";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "../../../assets/scss/pages/table.scss";
import { getAPI, postAPI, putAPI } from "../../../Services/Apis";
import { toast } from "react-toastify";
import moment from "moment/moment";
import { getUserDetails } from "../../../common/utility";
import loader from "../../../assets/images/instaone-loader.svg";
import { LoaderHide, LoaderShow } from "../../../helpers/common_constants";
import logoSvg from "../../../assets/images/Instaone.png";
// Create a type for react-dnd
const ItemType = {
  COLUMN: "COLUMN",
};

// DraggableColumn Component
const DraggableColumn = ({ column, index, moveColumn, children }) => {
  const ref = React.useRef(null);

  const [, drop] = useDrop({
    accept: ItemType.COLUMN,
    hover(item, monitor) {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleX =
        (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientX = clientOffset.x - hoverBoundingRect.left;

      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) return;
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) return;

      moveColumn(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType.COLUMN,
    item: { type: ItemType.COLUMN, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <th ref={ref} style={{ opacity: isDragging ? 0.5 : 1, cursor: "move" }}>
      {children}
    </th>
  );
};
const AccountVendorPayment = () => {
  const [data, setData] = useState([]);

  const loginUser = getUserDetails();
  const [columns, setColumns] = useState([
    { key: "ticketID", label: "Ticket ID" },
    { key: "engineerName", label: "Engineer Name" },
    { key: "formetedDate", label: "Date" },
    // { key: "siteID", label: "Site ID" },
    // { key: "services", label: "Service" },
    { key: "servicePrice", label: "Total" },
    { key: "vendorPaymentstatus", label: "Status " },
    // { key: "paymentstatus", label: "Status" },

    // { key: 'actions', label: 'Actions' },
  ]);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  const [search, setSearch] = useState("");
  const [searchColumn, setSearchColumn] = useState({});
  const [selectedRows, setSelectedRows] = useState([]);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [manageColumnsDropdownOpen, setManageColumnsDropdownOpen] =
    useState(false);
  const [showEntriesDropdownOpen, setShowEntriesDropdownOpen] = useState(false);
  const [columnsVisibility, setColumnsVisibility] = useState({
    ticketID: true,
    engineerName: true,
    formetedDate: true,
    // servicePrice:
    servicePrice: true,
    // paymentstatus: true,
    vendorPaymentstatus: true,
    // actions: true,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [payModal, setPayModal] = useState(false);
  const togglePayModal = () => setPayModal(!payModal);
  const toggleExportDropdown = () => setExportDropdownOpen(!exportDropdownOpen);
  const toggleManageColumnsDropdown = () =>
    setManageColumnsDropdownOpen(!manageColumnsDropdownOpen);
  const toggleShowEntriesDropdown = () =>
    setShowEntriesDropdownOpen(!showEntriesDropdownOpen);

  const [selectedPaymentUser, setSelectedPaymentUser] = useState({
    assign: [{ userDetails: [{ bankDetails: {} }] }],
  });

  useEffect(() => {
    getTicketDetails();
  }, []);
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

  const getTicketDetails = async () => {
    try {
      LoaderShow();
      const response = await getAPI("ticket/get-ticket-user");
      if (response.statusCode === 200) {
        LoaderHide();
        const output = response.data
          .filter((ticket) => ticket.status == "done")
          .sort((a, b) => {
            const dateA = moment(
              a.date_created,
              "DD-MM-YYYY HH:mm:ss"
            ).toDate();
            const dateB = moment(
              b.date_created,
              "DD-MM-YYYY HH:mm:ss"
            ).toDate();
            return dateB - dateA; // Sort in descending order
          })
          .map((item) => {
            const formetedDate = moment(
              item.date_created,
              "DD-MM-YYYY HH:mm:ss"
            ).format("DD-MM-YYYY");

            // Construct the new object with formetedDate inserted after date_created
            return {
              ...item,
              formetedDate,
            };
          });

        setData(output);

        LoaderHide();
      }
    } catch (error) {
      toast.error(error.message);
      LoaderHide();
    }
  };

  const saveTransactionId = async () => {
    try {
      const id = document.getElementById("txnId").value;

      if (id.length > 0) {
        const data = {
          ticketID: selectedPaymentUser.ticketID,
          transactionId: id,
        };
        LoaderShow();
        const response = await postAPI("ticket/save-transaction", data);
        if (response.statusCode === 200) {
          toast.success(response.message);
          LoaderHide();
          togglePayModal();
        }
      } else {
        toast.error("Please add transaction Id");
        LoaderHide();
      }
    } catch (error) {
      toast.error(error.message);
      LoaderHide();
    }
  };

  const handleColumnSearch = (e, column) => {
    setSearchColumn({ ...searchColumn, [column]: e.target.value });
  };

  const handleSelectRow = (_id) => {
    setSelectedRows((prev) =>
      prev.includes(_id)
        ? prev.filter((rowId) => rowId !== _id)
        : [...prev, _id]
    );
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "pending":
        return "badge bg-danger ";
      case "done":
        return "badge bg-success ";
      default:
        return "badge bg-secondary";
    }
  };

  const handleSelectAllRows = () => {
    if (selectedRows.length === data.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(data.map((row) => row._id));
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [
        [
          "Ticket ID",
          "Date",
          "Assigned To",
          // "Site ID",
          // "Service",
          "Service Price ",
          "Payment Status",
        ],
      ],
      body: selectedRows.length
        ? data
            .filter((row) => selectedRows.includes(row._id))
            .map((row) => {
              const userDetails = row?.assign?.[0]?.userDetails?.[0];
              const assignedTo =
                userDetails?.role === "company"
                  ? userDetails?.companyName || "N/A"
                  : `${userDetails?.firstName || ""} ${
                      userDetails?.lastName || ""
                    }`.trim() || "N/A";
              return [
                row?.ticketID,
                row?.formetedDate,
                assignedTo,
                row?.servicePrice,
                row?.paymentstatus,
              ];
            })
        : data.map((row) => {
            const userDetails = row?.assign?.[0]?.userDetails?.[0];
            const assignedTo =
              userDetails?.role === "company"
                ? userDetails?.companyName || "N/A"
                : `${userDetails?.firstName || ""} ${
                    userDetails?.lastName || ""
                  }`.trim() || "N/A";
            return [
              row?.ticketID,
              row?.formetedDate,
              assignedTo,
              row?.servicePrice,
              row?.paymentstatus,
            ];
          }),
    });
    doc.save("payment.pdf");
  };

  const filteredData = data
    .filter((row) => {
      return (
        row?.ticketID.toLowerCase().includes(search.toLowerCase()) ||
        (row?.assign?.[0]?.name &&
          row.assign[0].name.toLowerCase().includes(search.toLowerCase())) ||
        row?.formetedDate.toLowerCase().includes(search.toLowerCase()) ||
        row?.servicePrice.toLowerCase().includes(search.toLowerCase()) ||
        row?.paymentstatus.toLowerCase().includes(search.toLowerCase()) ||
        row?.vendorPaymentstatus.toLowerCase().includes(search.toLowerCase())
      );
    })
    .filter((row) => {
      return Object.keys(searchColumn).every((key) =>
        row[key]
          .toString()
          .toLowerCase()
          .includes(searchColumn[key].toLowerCase())
      );
    });

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSelectAllColumns = () => {
    const allVisible = Object.values(columnsVisibility).every((v) => v);
    const newVisibility = {};
    for (let key in columnsVisibility) {
      newVisibility[key] = !allVisible;
    }
    setColumnsVisibility(newVisibility);
  };

  const sortData = (key) => {
    let sortedData = [...data];
    let direction = "ascending";

    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
      sortedData.reverse();
    } else {
      sortedData.sort((a, b) => (a[key] > b[key] ? 1 : -1));
    }

    setSortConfig({ key, direction });
    setData(sortedData);
  };

  const getIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? "▲" : "▼";
    }
    return "▲";
  };
  const download = (fileUrl, filenameInitial) => {
    fetch(fileUrl, {
      method: "GET",
      headers: {},
    })
      .then((response) => response.arrayBuffer())
      .then((buffer) => {
        const blob = new Blob([buffer]); // Create a Blob object from the buffer
        const url = window.URL.createObjectURL(blob);

        // Extract the file name from the URL
        const fileName = fileUrl.split("/").pop(); // Get the last part of the URL
        let prefixedFileName;
        if (filenameInitial === "sow") {
          prefixedFileName = `sow_${fileName}`; // Add 'sow_' prefix to the file name
        } else if (filenameInitial === "irFile") {
          prefixedFileName = `irFile_${fileName}`; // Add 'sow_' prefix to the file name
        } else if (filenameInitial === "completedWork") {
          prefixedFileName = `completedWork_${fileName}`; // Add 'sow_' prefix to the file name
        } else if (filenameInitial === "vendorIRFile") {
          prefixedFileName = `vendorIRFile_${fileName}`; // Add 'sow_' prefix to the file name
        } else {
          prefixedFileName = `${fileName}`; // Add 'sow_' prefix to the file name
        }

        // Create a temporary link element for downloading the file
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", prefixedFileName); // Set the prefixed file name
        document.body.appendChild(link);
        link.click(); // Trigger the download
        document.body.removeChild(link); // Clean up the link after download
      })
      .catch((err) => {
        toast.error("Error downloading the file", err);
      });
  };
  const moveColumn = useCallback(
    (dragIndex, hoverIndex) => {
      const newColumns = [...columns];
      const [draggedColumn] = newColumns.splice(dragIndex, 1);
      newColumns.splice(hoverIndex, 0, draggedColumn);
      setColumns(newColumns);
    },
    [columns]
  );

  const confirmPayModal = (_id, row) => {
    togglePayModal();
    setSelectedPaymentUser(row || {});
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Payment" breadcrumbItem="Vendor Payment" />
          <div
            id="hideloding"
            className="loding-display"
            style={{ display: "none" }}
          >
            <img src={loader} alt="loader-img" />
          </div>
          <Row>
            <Col xl={12}>
              <Card>
                <Row>
                  <Col xl={12}>
                    <div className="table-settings">
                      <Dropdown
                        isOpen={exportDropdownOpen}
                        toggle={toggleExportDropdown}
                        className="d-inline-block  btn-light me-2"
                      >
                        <DropdownToggle caret>
                          <i className="dripicons-export"></i>
                        </DropdownToggle>
                        <DropdownMenu right className="me-2">
                          <DropdownItem onClick={handleExportPDF}>
                            Export to PDF
                          </DropdownItem>
                          <CSVLink
                            data={
                              selectedRows.length
                                ? data
                                    .filter((row) =>
                                      selectedRows.includes(row._id)
                                    )
                                    .map(
                                      ({
                                        ticketID,
                                        formetedDate,
                                        servicePrice,
                                        status,
                                        assign,
                                      }) => {
                                        const userDetails =
                                          assign?.[0]?.userDetails?.[0];
                                        const engineerName =
                                          userDetails?.role === "company"
                                            ? userDetails?.companyName || "N/A"
                                            : `${
                                                userDetails?.firstName || ""
                                              } ${
                                                userDetails?.lastName || ""
                                              }`.trim() || "N/A";
                                        return {
                                          ticketID,
                                          engineerName,
                                          formetedDate,
                                          servicePrice,
                                          status,
                                        };
                                      }
                                    )
                                : data.map(
                                    ({
                                      ticketID,
                                      formetedDate,
                                      servicePrice,
                                      status,
                                      assign,
                                    }) => {
                                      const userDetails =
                                        assign?.[0]?.userDetails?.[0];
                                      const engineerName =
                                        userDetails?.role === "company"
                                          ? userDetails?.companyName || "N/A"
                                          : `${userDetails?.firstName || ""} ${
                                              userDetails?.lastName || ""
                                            }`.trim() || "N/A";
                                      return {
                                        ticketID,
                                        engineerName,
                                        formetedDate,
                                        servicePrice,
                                        status,
                                      };
                                    }
                                  )
                            }
                            headers={[
                              { label: "Ticket ID", key: "ticketID" },
                              { label: "Engineer Name", key: "engineerName" },
                              { label: "Date", key: "formetedDate" },
                              { label: "Total", key: "servicePrice" },
                              { label: "Status", key: "status" },
                            ]}
                            filename={"Payment-Data.csv"}
                          >
                            <DropdownItem>Export to CSV</DropdownItem>
                          </CSVLink>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  </Col>
                </Row>
                <CardBody>
                  <div className="table-responsive">
                    <Table className="table mb-0">
                      <thead className="table-light">
                        <tr style={{ textAlign: "center" }}>
                          <th style={{ width: "64px", paddingLeft: "5px" }}>
                            <span>
                              <Dropdown
                                isOpen={manageColumnsDropdownOpen}
                                toggle={toggleManageColumnsDropdown}
                                className="d-inline-block manage-col me-2"
                              >
                                <DropdownToggle caret>
                                  <i className="dripicons-preview"></i>
                                </DropdownToggle>
                                <DropdownMenu left>
                                  <DropdownItem toggle={false}>
                                    <Input
                                      type="checkbox"
                                      checked={Object.values(
                                        columnsVisibility
                                      ).every((v) => v)}
                                      onChange={handleSelectAllColumns}
                                    />{" "}
                                    Select All
                                  </DropdownItem>
                                  {Object.keys(columnsVisibility).map((col) => (
                                    <DropdownItem key={col} toggle={false}>
                                      <Input
                                        type="checkbox"
                                        checked={columnsVisibility[col]}
                                        onChange={() =>
                                          setColumnsVisibility({
                                            ...columnsVisibility,
                                            [col]: !columnsVisibility[col],
                                          })
                                        }
                                      />{" "}
                                      {col}
                                    </DropdownItem>
                                  ))}
                                </DropdownMenu>
                              </Dropdown>
                            </span>
                            <Input
                              type="checkbox"
                              onChange={handleSelectAllRows}
                              checked={selectedRows.length === data.length}
                            />
                          </th>
                          {columns.map(
                            (column, index) =>
                              columnsVisibility[column.key] && (
                                <DraggableColumn
                                  key={column.key}
                                  column={column}
                                  index={index}
                                  moveColumn={moveColumn}
                                >
                                  <div className="d-flex align-items-center">
                                    <span
                                      className="sort-icon"
                                      onClick={() => sortData(column.key)}
                                    >
                                      {column.label} {getIcon(column.key)}
                                    </span>
                                  </div>
                                </DraggableColumn>
                              )
                          )}

                          <th style={{ minWidth: "100px", paddingLeft: "5px" }}>
                            Payment
                          </th>
                        </tr>
                        <tr className="search-col">
                          <th></th>
                          {columns.map(
                            (column) =>
                              columnsVisibility[column.key] && (
                                <th key={column.key}>
                                  <Input
                                    type="text"
                                    placeholder={`Search ${column.label}`}
                                    value={searchColumn[column.key] || ""}
                                    onChange={(e) =>
                                      handleColumnSearch(e, column.key)
                                    }
                                  />
                                </th>
                              )
                          )}
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedData.map((row) => (
                          <tr style={{ textAlign: "center" }} key={row._id}>
                            <td
                              style={{ minWidth: "64px", paddingLeft: "5px" }}
                            >
                              <Input
                                type="checkbox"
                                checked={selectedRows.includes(row._id)}
                                onChange={() => handleSelectRow(row._id)}
                              />
                            </td>
                            {columns.map(
                              (column) =>
                                columnsVisibility[column.key] && (
                                  <td
                                    key={column.key}
                                    style={
                                      column.key === "ticketID"
                                        ? {
                                            cursor: "pointer",
                                            textDecoration: "underline",
                                            color: "#ed8d21",
                                          }
                                        : {}
                                    }
                                  >
                                    {column.key === "ticketID" ? (
                                      <>
                                        {location?.pathname ===
                                        "/admin/payment" ? (
                                          <Link
                                            to={`/admin/ticket-payment-details/${row.ticketID}`}
                                            state={{ ticketData: row }}
                                            style={{
                                              textDecoration: "none",
                                              color: "#ed8d21",
                                            }}
                                          >
                                            {row[column.key]}
                                          </Link>
                                        ) : location?.pathname ===
                                          "/customer/payment" ? (
                                          <Link
                                            to={`/customer/ticket-payment-details/${row.ticketID}`}
                                            state={{ ticketData: row }}
                                            style={{
                                              textDecoration: "none",
                                              color: "#ed8d21",
                                            }}
                                          >
                                            {row[column.key]}
                                          </Link>
                                        ) : location?.pathname ===
                                          "/account/payment" ? (
                                          <Link
                                            to={`/account/ticket-details/${row.ticketID}`}
                                            state={{ ticketData: row }}
                                            style={{
                                              textDecoration: "none",
                                              color: "#ed8d21",
                                            }}
                                          >
                                            {row[column.key]}
                                          </Link>
                                        ) : (
                                          <Link
                                            to={`/default/ticket-details/${row.ticketID}`}
                                            state={{ ticketData: row }}
                                            style={{
                                              textDecoration: "none",
                                              color: "#ed8d21",
                                            }}
                                          >
                                            {row[column.key]}
                                          </Link>
                                        )}
                                      </>
                                    ) : column.key === "invoiceFile" ? (
                                      <span>
                                        <a
                                          className="btn btn-soft-light"
                                          href={row[column.key]}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          <i className="far fa-eye"></i>
                                        </a>

                                        <span
                                          onClick={() =>
                                            download(
                                              row[column.key],
                                              "invoiceFile"
                                            )
                                          }
                                          className="btn btn-soft-light"
                                          rel="noopener noreferrer"
                                        >
                                          <i className="bx bx-download label-icon"></i>
                                        </span>
                                      </span>
                                    ) : column.key === "vendorPaymentstatus" ? (
                                      row[column.key] === "pending" ? (
                                        <span
                                          className={getStatusBadgeClass(
                                            row[column.key]
                                          )}
                                        >
                                          {row[column.key]}
                                        </span>
                                      ) : row[column.key] === "done" ? (
                                        <span
                                          className={getStatusBadgeClass(
                                            row[column.key]
                                          )}
                                        >
                                          {row[column.key]}
                                        </span>
                                      ) : !row[column.key] ||
                                        row[column.key] === null ? (
                                        <span
                                          className={getStatusBadgeClass(
                                            "pending"
                                          )}
                                        >
                                          pending
                                        </span>
                                      ) : (
                                        <span
                                          className={getStatusBadgeClass(
                                            row[column.key]
                                          )}
                                        >
                                          {row[column.key]}
                                        </span>
                                      )
                                    ) : column.key === "engineerName" ? (
                                      row.assign[0].name
                                    ) : (
                                      row[column.key]
                                    )}
                                  </td>
                                )
                            )}
                            <td>
                              <button
                                onClick={() => confirmPayModal(row._id, row)}
                                className="me-1 btn btn-warning"
                                disabled={row.vendorPaymentstatus === "done"}
                              >
                                {row.vendorPaymentstatus === "done"
                                  ? "Paid"
                                  : "Pay"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                  <Pagination
                    aria-label="Page navigation example"
                    className="mt-3"
                  >
                    <PaginationItem disabled={currentPage === 1}>
                      <PaginationLink
                        previous
                        onClick={() => handlePageChange(currentPage - 1)}
                      />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, index) => (
                      <PaginationItem
                        active={index + 1 === currentPage}
                        key={index}
                      >
                        <PaginationLink
                          onClick={() => handlePageChange(index + 1)}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem disabled={currentPage === totalPages}>
                      <PaginationLink
                        next
                        onClick={() => handlePageChange(currentPage + 1)}
                      />
                    </PaginationItem>
                    <Dropdown
                      isOpen={showEntriesDropdownOpen}
                      toggle={toggleShowEntriesDropdown}
                      style={{ marginLeft: "20px" }}
                      className="d-inline-block me-2"
                    >
                      <DropdownToggle caret>Show Entries</DropdownToggle>
                      <DropdownMenu right>
                        {[10, 20, 30, 40].map((number) => (
                          <DropdownItem
                            key={number}
                            onClick={() => setItemsPerPage(number)}
                          >
                            {number} entries
                          </DropdownItem>
                        ))}
                      </DropdownMenu>
                    </Dropdown>
                  </Pagination>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
        <Modal isOpen={payModal} toggle={togglePayModal}>
          <ModalHeader toggle={togglePayModal}>Verify OTP</ModalHeader>
          <ModalBody>
            <div className="row">
              <h5>Bank Details</h5>
              <div className="col-lg-6">
                {selectedPaymentUser?.assign?.[0]?.userDetails?.[0]
                  ?.bankDetails ? (
                  <>
                    <div className="mb-3">
                      <label className="form-label">Bank Holder Name :</label>
                      <span style={{ marginLeft: "5px" }}>
                        {selectedPaymentUser?.assign?.[0]?.userDetails?.[0]
                          ?.bankDetails?.accountHolderName || "N/A"}
                      </span>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Account Number :</label>
                      <span style={{ marginLeft: "5px" }}>
                        {selectedPaymentUser?.assign?.[0]?.userDetails?.[0]
                          ?.bankDetails?.accountNumber || "N/A"}
                      </span>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Account Type :</label>
                      <span style={{ marginLeft: "5px" }}>
                        {selectedPaymentUser?.assign?.[0]?.userDetails?.[0]
                          ?.bankDetails?.accountType || "N/A"}
                      </span>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Bank Name :</label>
                      <span style={{ marginLeft: "5px" }}>
                        {selectedPaymentUser?.assign?.[0]?.userDetails?.[0]
                          ?.bankDetails?.bankName || "N/A"}
                      </span>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">IFSC Code :</label>
                      <span style={{ marginLeft: "5px" }}>
                        {selectedPaymentUser?.assign?.[0]?.userDetails?.[0]
                          ?.bankDetails?.ifscCode || "N/A"}
                      </span>
                    </div>
                  </>
                ) : (
                  <p>No Bank Details Available</p>
                )}

                <div className="mb-3">
                  <label
                    htmlFor="basicpill-lastname-input"
                    className="form-label"
                  >
                    Transaction ID{" "}
                  </label>
                  <input
                    type="text"
                    name="txnId"
                    className="form-control"
                    id="txnId"
                  />
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={togglePayModal}>
              Cancel
            </Button>{" "}
            <Button color="success" onClick={saveTransactionId}>
              Done
            </Button>{" "}
          </ModalFooter>
        </Modal>
      </div>
    </DndProvider>
  );
};

export default AccountVendorPayment;
