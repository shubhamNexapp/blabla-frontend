import React, { useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
import { getAPI, postAPI } from "../../../Services/Apis";
import { toast } from "react-toastify";
import moment from "moment/moment";
import { getUserDetails } from "../../../common/utility";
import loader from "../../../assets/images/instaone-loader.svg";
import { LoaderHide, LoaderShow } from "../../../helpers/common_constants";

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

const Index = ({ customerID }) => {
  const [data, setData] = useState([]);

  const location = useLocation();

  const [columns, setColumns] = useState([
    { key: "ticketID", label: "Ticket ID" },
    { key: "ticketName", label: "Name" },
    { key: "assign", label: "Assign to" },
    { key: "formetedDate", label: "Date" },
    { key: "mobileNumber", label: "Mobile Number" },
    { key: "status", label: "Status" },
    { key: "siteAddress", label: "Site Address" },
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
    ticketName: true,
    assign: true,
    status: true,
    formetedDate: true,
    id: true,
    siteAddress: true,
    actions: true,
    // firstName: true,
    // username: true,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteModal, setDeleteModal] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);

  const toggleExportDropdown = () => setExportDropdownOpen(!exportDropdownOpen);
  const toggleManageColumnsDropdown = () =>
    setManageColumnsDropdownOpen(!manageColumnsDropdownOpen);
  const toggleShowEntriesDropdown = () =>
    setShowEntriesDropdownOpen(!showEntriesDropdownOpen);
  const toggleDeleteModal = () => setDeleteModal(!deleteModal);

  // const navigate = useNavigate();

  const goToTicketDetailsPage = (ticketData) => {
    // navigate(`/customer/ticket-details/${ticketData.ticketID}`, {
    //   state: {
    //     row: ticketData,
    //   },
    // });
  };

  useEffect(() => {
    getTicketDetails();
  }, []);

  const [modalCenter, setModalCenter] = useState(false);
  const [ticketDetails, setTicketDetails] = useState(false);

  const toggleModal = (details) => {
    setTicketDetails(details);
    setModalCenter(!modalCenter);
  };

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

  const loginUser = getUserDetails();

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

  const deleteTicket = async () => {
    try {
      LoaderShow();
      const data = { ticketID: rowToDelete };
      const response = await postAPI("ticket/delete-ticket", data);
      if (response.statusCode === 200) {
        toast.success(response.message);
        getTicketDetails();
        toggleDeleteModal();
        LoaderHide();
      }
    } catch (error) {
      toast.error(error.message);
      LoaderHide();
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
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
      case "created":
        return "badge bg-warning ";
      case "accepted":
        return "badge bg-info ";
      case "rejected":
        return "badge bg-danger ";
      case "done":
        return "badge bg-success ";
      default:
        return "badge bg-info";
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
          "Ticket Name",
          "Assign To",
          "Date",
          "Status",
          "Site Address",
        ],
      ],
      body: selectedRows.length
        ? data
            .filter((row) => selectedRows.includes(row._id))
            .map((row) => [
              row.ticketID,
              row.ticketName,
              row?.status === "created"
                ? "Waiting for assign"
                : row.assign[0]?.name,
              row.formetedDate,
              row.status,
              row.siteAddress,
            ])
        : data.map((row) => [
            row.ticketID,
            row.ticketName,
            row?.status === "created"
              ? "Waiting for assign"
              : row.assign[0]?.name,
            row.formetedDate,
            row.status,
            row.siteAddress,
          ]),
    });
    doc.save("Tickets.pdf");
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
        row.ticketID.toLowerCase().includes(search.toLowerCase()) ||
        row.ticketName.toLowerCase().includes(search.toLowerCase()) ||
        row.assign.toLowerCase().includes(search.toLowerCase()) ||
        row.status.toLowerCase().includes(search.toLowerCase())
        // row.date.toLowerCase().includes(search.toLowerCase())
        // row.firstName.toLowerCase().includes(search.toLowerCase()) ||
        // row.username.toLowerCase().includes(search.toLowerCase()) ||
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

  // const toggleSearch = (column) => {
  //     setSearchVisible(prev => ({
  //         ...prev,
  //         [column]: !prev[column]
  //     }));
  // };

  const sortData = (key) => {
    console.log("sort key", key);
    let sortedData = [...data];
    let direction = "ascending";

    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
      if (key == "formetedDate") {
        // sortedData.sort((a, b) => new Date(b) - new Date(a))
        sortedData.sort((a, b) => {
          const [dayA, monthA, yearA] = a.formetedDate.split("-");
          const [dayB, monthB, yearB] = b.formetedDate.split("-");
          const dateA = new Date(`${yearA}-${monthA}-${dayA}`);
          const dateB = new Date(`${yearB}-${monthB}-${dayB}`);
          return dateB - dateA; // Reverse sorting (latest first)
        });
      } else {
        sortedData.reverse();
      }
    } else {
      direction = "ascending";
      if (key == "formetedDate") {
        sortedData.sort((a, b) => {
          const [dayA, monthA, yearA] = a.formetedDate.split("-");
          const [dayB, monthB, yearB] = b.formetedDate.split("-");
          const dateA = new Date(`${yearA}-${monthA}-${dayA}`);
          const dateB = new Date(`${yearB}-${monthB}-${dayB}`);
          return dateA - dateB; // Ascending order
        });
      } else {
        sortedData.sort((a, b) => (a[key] > b[key] ? 1 : -1));
      }
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

  const moveColumn = useCallback(
    (dragIndex, hoverIndex) => {
      const newColumns = [...columns];
      const [draggedColumn] = newColumns.splice(dragIndex, 1);
      newColumns.splice(hoverIndex, 0, draggedColumn);
      setColumns(newColumns);
    },
    [columns]
  );

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
          <h4 className="card-title">All Tickets</h4>
        </div>
      </CardHeader>
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
                          .filter((row) => selectedRows.includes(row._id)) // Filter based on selected rows
                          .map((row) => ({
                            ticketID: row.ticketID,
                            ticketName: row.ticketName,
                            assign:
                              row.status === "created"
                                ? "Waiting for assign"
                                : row.assign && row.assign[0]?.name
                                ? row.assign[0]?.name
                                : "Not assigned",
                            formetedDate: row.formetedDate,
                            status: row.status,
                            siteAddress: row.siteAddress,
                          }))
                      : data.map((row) => ({
                          ticketID: row.ticketID,
                          ticketName: row.ticketName,
                          assign:
                            row.status === "created"
                              ? "Waiting for assign"
                              : row.assign && row.assign[0]?.name
                              ? row.assign[0]?.name
                              : "Not assigned",
                          formetedDate: row.formetedDate,
                          status: row.status,
                          siteAddress: row.siteAddress,
                        }))
                  }
                  headers={[
                    { label: "Ticket ID", key: "ticketID" },
                    { label: "Ticket Name", key: "ticketName" },
                    { label: "Assigned To", key: "assign" },
                    { label: "Date", key: "formetedDate" },
                    { label: "Status", key: "status" },
                    { label: "Site Address", key: "siteAddress" },
                  ]}
                  filename={"Tickets.csv"}
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

                {/* {columnsVisibility.actions && <th>Actions</th>} */}
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
                            onChange={(e) => handleColumnSearch(e, column.key)}
                          />
                        )}
                      </th>
                    )
                )}
                {columnsVisibility.actions && <th></th>}
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
                          {/* Conditional rendering for ticketID column with Link */}
                          {column.key === "ticketID" ? (
                            <>
                              {location?.pathname === "/admin/tickets" ? (
                                <Link
                                  to={`/admin/ticket-details/${row.ticketID}`} // Link to the ticket details page for admin
                                  state={{ ticketData: row }} // Passing only the clicked row's data
                                  style={{
                                    textDecoration: "none",
                                    color: "#ed8d21",
                                  }}
                                >
                                  {row[column.key]}
                                </Link>
                              ) : location?.pathname === "/customer/tickets" ? (
                                <Link
                                  to={`/customer/ticket-details/${row.ticketID}`} // Link to the ticket details page for customer
                                  state={{ ticketData: row }} // Passing only the clicked row's data
                                  style={{
                                    textDecoration: "none",
                                    color: "#ed8d21",
                                  }}
                                >
                                  {row[column.key]}
                                </Link>
                              ) : (
                                <Link
                                  to={`/admin/ticket-details/${row.ticketID}`} // Default link, can adjust if needed
                                  state={{ ticketData: row }} // Passing only the clicked row's data
                                  style={{
                                    textDecoration: "none",
                                    color: "#ed8d21",
                                  }}
                                >
                                  {row[column.key]}
                                </Link>
                              )}
                            </>
                          ) : column.key === "status" ? (
                            <span
                              className={getStatusBadgeClass(row[column.key])}
                            >
                              {row[column.key]}
                            </span>
                          ) : column.key === "assign" ? (
                            row.status === "created" ? (
                              "Waiting for assign"
                            ) : row.assign && row.assign.length > 0 ? (
                              <b>{row.assign[0]?.name}</b>
                            ) : (
                              "Not assigned"
                            )
                          ) : (
                            row[column.key]
                          )}
                        </td>
                      )
                  )}
                  {/* 
                            {columnsVisibility.actions && (
                              <td>
                                {row.status !== "done" ? (
                                  <DropdownComponent
                                    row={row}
                                    confirmDelete={confirmDelete}
                                  />
                                ) : null}
                              </td>
                            )} */}
                </tr>
              ))}
            </tbody>
            {/* <tbody>
                        {paginatedData.map((row) => (
                          <tr style={{ textAlign: "center" }} key={row.id}>
                            <td
                              style={{ minWidth: "64px", paddingLeft: "5px" }}
                            >
                              <Input
                                type="checkbox"
                                checked={selectedRows.includes(row.id)}
                                onChange={() => handleSelectRow(row.id)}
                              />
                            </td>
                            <td>{row.ticketID}</td>
                            <td>{row.ticketName}</td>
                            <td>
                              {row.status === "created"
                                ? "Waiting for assign"
                                : row.assign[0]}
                            </td>
                            <td>{row.formetedDate}</td>
                            <td>
                              {" "}
                              <span className={getStatusBadgeClass(row.status)}>
                                {row.status}
                              </span>
                            </td>
                            {columnsVisibility.actions && (
                              <td>
                                <DropdownComponent
                                  row={row}
                                  confirmDelete={confirmDelete}
                                />
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody> */}
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
      <Modal isOpen={deleteModal} toggle={toggleDeleteModal}>
        <ModalHeader toggle={toggleDeleteModal}>Confirm Delete</ModalHeader>
        <ModalBody>
          Are you sure you want to delete this ticket <b>{`${rowToDelete}`}</b>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleDeleteModal}>
            Cancel
          </Button>
          <Button color="danger" onClick={() => deleteTicket(rowToDelete)}>
            Delete
          </Button>{" "}
        </ModalFooter>
      </Modal>
    </>
  );
};

const DropdownComponent = ({ row, confirmDelete }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const navigate = useNavigate();

  const goToEditPage = (ticketData) => {
    navigate(`/admin/edit-ticket/${ticketData.ticketID}`, {
      state: {
        row: ticketData,
      },
    });
  };

  return (
    <Dropdown className="action" isOpen={dropdownOpen} toggle={toggleDropdown}>
      <DropdownToggle caret>
        <i className="dripicons-dots-3"></i>
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem onClick={() => goToEditPage(row)}>
          {/* <Link
            to={`/edit-ticket/${row.ticketID}`}
            state={{ row: row }} // Pass entire row data as state
            className="btn btn-primary btn-sm me-2"
         >  */}
          Edit
          {/* </Link> */}
        </DropdownItem>
        <DropdownItem onClick={() => confirmDelete(row.ticketID)}>
          Delete
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default Index;
