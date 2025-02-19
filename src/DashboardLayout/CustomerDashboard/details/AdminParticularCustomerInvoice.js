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
const AdminParticularCustomerInvoice = ({ customerID }) => {
  const [data, setData] = useState([]);

  const loginUser = getUserDetails();
  const [columns, setColumns] = useState([
    { key: "ticketID", label: "Ticket ID" },
    { key: "formetedDate", label: "Date" },

    { key: "siteID", label: "Site ID" },
    { key: "services", label: "Service" },
    { key: "servicePrice", label: "Amount" },
    { key: "invoiceFile", label: "Invoice File " },
    { key: "paymentstatus", label: "Payment Status" },

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
    formetedDate: true,
    siteID: true,
    services: true,
    servicePrice: true,
    paymentstatus: true,
    invoiceFile: true,
    // actions: true,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteModal, setDeleteModal] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [reload, setReload] = useState(false);

  const toggleExportDropdown = () => setExportDropdownOpen(!exportDropdownOpen);
  const toggleManageColumnsDropdown = () =>
    setManageColumnsDropdownOpen(!manageColumnsDropdownOpen);
  const toggleShowEntriesDropdown = () =>
    setShowEntriesDropdownOpen(!showEntriesDropdownOpen);
  const toggleDeleteModal = () => setDeleteModal(!deleteModal);

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
      const data = { userId: customerID };
      const response = await postAPI("ticket/get-ticket-userId", data);
      if (response.statusCode === 200) {
        LoaderHide();
        const output = response.data
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

        const filteredTickets = output.filter(
          (ticket) => ticket.userId === loginUser.userId
        );
        {
          role == "customer" && setData(filteredTickets);
        }
        {
          role == "admin" && setData(output);
        }
        LoaderHide();
      }
    } catch (error) {
      toast.error(error.message);
      LoaderHide();
    }
  };

  const deleteSite = async () => {
    try {
      LoaderShow();
      const data = { siteID: rowToDelete };
      console.log(data);
      const response = await postAPI("site/delete-site", data);
      if (response.statusCode === 200) {
        LoaderHide();
        toast.success(response.message);
        getSiteDetails();
        toggleDeleteModal();
      }
    } catch (error) {
      LoaderHide();
      toast.error(error.message);
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
          "Site ID",
          "Service",
          "Service Price ",
          "Payment Status",
        ],
      ],
      body: selectedRows.length
        ? data
            .filter((row) => selectedRows.includes(row._id))
            .map((row) => [
              row?.ticketID,
              row?.formetedDate,
              row?.siteID,
              row?.services,
              row?.servicePrice,
              row?.paymentstatus,
            ])
        : data.map((row) => [
            row?.ticketID,
            row?.formetedDate,
            row?.siteID,
            row?.services,
            row?.servicePrice,
            row?.paymentstatus,
          ]),
    });
    doc.save("payment.pdf");
  };

  const handleDelete = (_id) => {
    setData(data.filter((row) => row._id !== _id));
    toggleDeleteModal();
  };

  const confirmDelete = (_id) => {
    setRowToDelete(_id);
    toggleDeleteModal();
  };

  const filteredData = data
    .filter((row) => {
      return (
        row?.ticketID.toLowerCase().includes(search.toLowerCase()) ||
        row?.formetedDate.toLowerCase().includes(search.toLowerCase()) ||
        row?.siteID.toLowerCase().includes(search.toLowerCase()) ||
        row?.services.toLowerCase().includes(search.toLowerCase()) ||
        row?.servicePrice.toLowerCase().includes(search.toLowerCase()) ||
        row?.paymentstatus.toLowerCase().includes(search.toLowerCase())
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
  // console.log(paginatedData)
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
    console.log("fileUrl, filenameInitial=====", fileUrl, filenameInitial);
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

  const paymentHandler = async (selectedRow) => {
    try {
      const selectData = data.filter((item) => item._id == selectedRow);

      console.log(selectData);
      const paymentData = {
        // amount: 100 * parseInt(selectData[0].servicePrice),
        amount: parseInt(selectData[0].servicePrice),
        currency: "INR",
        receipt: "Instaone#4",
      };
      const ticketId = {
        ticketID: selectData[0].ticketID,
      };
      LoaderShow();
      const response = await postAPI("payment/order", paymentData);
      console.log("payment", response);

      LoaderHide();
      // const updatePayment = await putAPI("ticket/payment-status", ticketId);

      var options = {
        key: "rzp_live_3ful3p6rL6Llag", // Enter the Key ID generated from the Dashboard
        amount: data.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: data.currency,
        name: "Instaone", //your business name
        description: "Test Transaction",
        image: { logoSvg },
        order_id: response.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        handler: async function (response) {
          const body = {
            ...response,
            ticketID: selectData[0].ticketID,
          };
          try {
            const validateRes = await postAPI("payment/order/validate", body);
            const jsonRes = await validateRes;
            if (jsonRes.msg === "success") {
              // updatePayment()
              toast.success("payment done successfully");
              getTicketDetails();
            }
            console.log(jsonRes);
          } catch (err) {
            console.log(err);
          }
        },
        prefill: {
          //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
          name: "Priya Ghuguskar", //your customer's name
          email: "priya.ghuguskar@example.com",
          contact: selectData[0].mobileNumber, //Provide the customer's phone number for better conversion rates
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#f4af3d",
        },
      };
      var rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
      });
      rzp1.open();

      e.preventDefault();
    } catch (err) {
      LoaderHide();
      console.log(err);
    }
  };
  return (
    <>
      <div
        id="hideloding"
        className="loding-display"
        style={{ display: "none" }}
      >
        <img src={loader} alt="loader-img" />
      </div>
      <CardHeader className="d-flex justify-content-between align-items-center">
        <div>
          <h4 className="card-title">All Invoices</h4>
        </div>
      </CardHeader>
      <Row>
        <Col xl={12}>
          <div className="table-settings">
            {selectedRows.length ? (
              <button
                onClick={() => paymentHandler(selectedRows)}
                className="me-2 btn btn-danger"
              >
                Pay
              </button>
            ) : null}
            {/* {selectedRows.length ? (
                                                <Link to="/add-ticket" className="me-2 btn btn-danger">
                                                    Pay
                                                </Link>
                                            ) : null} */}
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
                      ? data.filter((row) => selectedRows.includes(row._id))
                      : data
                  }
                  filename={"table.csv"}
                >
                  <DropdownItem>Export to CSV</DropdownItem>
                </CSVLink>
              </DropdownMenu>
            </Dropdown>
          </div>
        </Col>
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
                              checked={Object.values(columnsVisibility).every(
                                (v) => v
                              )}
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

                  {columnsVisibility.actions && <th>Actions</th>}
                </tr>
                <tr className="search-col">
                  <th></th>
                  {columns.map(
                    (column) =>
                      columnsVisibility[column.key] && (
                        <th key={column.key}>
                          {[column.key] && (
                            <Input
                              type="text"
                              placeholder={`Search ${column.label}`}
                              value={searchColumn[column.key] || ""}
                              onChange={(e) =>
                                handleColumnSearch(e, column.key)
                              }
                            />
                          )}
                        </th>
                      )
                  )}
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row) => (
                  <tr style={{ textAlign: "center" }} key={row._id}>
                    <td style={{ minWidth: "64px", paddingLeft: "5px" }}>
                      <Input
                        type="checkbox"
                        checked={selectedRows.includes(row._id)}
                        onChange={() => handleSelectRow(row._id)}
                      />
                    </td>
                    {columns.map(
                      (column) =>
                        columnsVisibility[column.key] && (
                          <td key={column.key}>
                            {row?.status === "done" && (
                              <>
                                {/* Condition for status */}
                                {column.key === "paymentstatus" ? (
                                  <span
                                    className={getStatusBadgeClass(
                                      row[column.key]
                                    )}
                                    style={{
                                      fontSize: "10px",
                                      textTransform: "capitalize",
                                    }}
                                  >
                                    {row[column.key]}
                                  </span>
                                ) : column.key === "invoiceFile" ? (
                                  // Condition for assign field with status check
                                  <span>
                                    <a
                                      className="btn btn-soft-light"
                                      href={row[column.key]}
                                      target="_blank" // This opens the file in a new tab
                                      rel="noopener noreferrer" // Security measure to prevent the new tab from accessing your page's window object
                                    >
                                      <i className="far fa-eye"></i>
                                    </a>
                                    {console.log("[column.key]====", [
                                      column.key,
                                    ])}
                                    <span
                                      onClick={() =>
                                        download(row[column.key], "invoiceFile")
                                      }
                                      className="btn btn-soft-light"
                                      rel="noopener noreferrer" // Security measure to prevent the new tab from accessing your page's window object
                                    >
                                      <i className="bx bx-download label-icon"></i>
                                    </span>
                                  </span>
                                ) : (
                                  // Default rendering for other fields
                                  row[column.key]
                                )}
                              </>
                            )}
                          </td>
                        )
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <Pagination aria-label="Page navigation example" className="mt-3">
            <PaginationItem disabled={currentPage === 1}>
              <PaginationLink
                previous
                onClick={() => handlePageChange(currentPage - 1)}
              />
            </PaginationItem>
            {[...Array(totalPages)].map((_, index) => (
              <PaginationItem active={index + 1 === currentPage} key={index}>
                <PaginationLink onClick={() => handlePageChange(index + 1)}>
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
      </Row>
      <Modal isOpen={deleteModal} toggle={toggleDeleteModal}>
        <ModalHeader toggle={toggleDeleteModal}>Confirm Delete</ModalHeader>
        <ModalBody>
          Are you sure you want to Pay this Site <b>{`${rowToDelete}`}</b>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={() => deleteSite(rowToDelete)}>
            Pay Now
          </Button>{" "}
          <Button color="secondary" onClick={toggleDeleteModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

const DropdownComponent = ({ row, confirmDelete }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const navigate = useNavigate();

  const goToEditPage = (siteData) => {
    console.log(siteData);
    navigate(`/customer/update-site/${siteData.siteID}`, {
      state: {
        row: siteData,
      },
    });
  };

  return (
    <Dropdown className="action" isOpen={dropdownOpen} toggle={toggleDropdown}>
      <DropdownToggle caret>
        <i className="dripicons-dots-3"></i>
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem onClick={() => goToEditPage(row)}>Edit</DropdownItem>
        <DropdownItem onClick={() => confirmDelete(row.siteID)}>
          Delete
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default AdminParticularCustomerInvoice;
