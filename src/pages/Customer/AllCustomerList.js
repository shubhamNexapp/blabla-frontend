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
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "../../assets/scss/pages/table.scss";
import { getAPI, postAPI } from "../../Services/Apis";
import TicketModal from "../../components/Modals/TicketModal";
import { toast } from "react-toastify";
import moment from "moment/moment";
import { getUserDetails } from "../../common/utility";

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

const AllCustomerList = () => {
  const [data, setData] = useState([]);

  const [columns, setColumns] = useState([
    { key: "companyName", label: "Company Name" },
    { key: "role", label: "Category" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Mobile No." },
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
    companyName: true,
    role: true,
    email: true,
    phone: true,
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

  useEffect(() => {
    getServicePartner();
  }, []);

  const [modalCenter, setModalCenter] = useState(false);
  const [ticketDetails, setTicketDetails] = useState(false);

  const toggleModal = (details) => {
    setTicketDetails(details);
    setModalCenter(!modalCenter);
  };

  const loginUser = getUserDetails();

  const getServicePartner = async () => {
    try {
      const response = await getAPI("auth/all-user");
      if (response.statusCode === 200) {
        const output = response.users;

        const filtereduser = output.filter((user) => user.role == "customer");
        console.log(filtereduser);
        setData(filtereduser);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteTicket = async () => {
    try {
      const data = { ticketID: rowToDelete };
      const response = await postAPI("ticket/delete-ticket", data);
      if (response.statusCode === 200) {
        toast.success(response.message);
        getServicePartner();
        toggleDeleteModal();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleColumnSearch = (e, column) => {
    setSearchColumn({ ...searchColumn, [column]: e.target.value });
  };

  const handleSelectRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
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
      head: [["Customer Name", "Category", "Email", "Mobile Number"]],
      body: selectedRows.length
        ? data
            .filter((row) => selectedRows.includes(row._id))
            .map((row) => [
              row?.companyName,
              row.role,
              row.email,
              row.phone,
            ])
        : data.map((row) => [
            row?.companyName,
            row.role,
            row.email,
            row.phone,
          ]),
    });
    doc.save("Customers.pdf");
  };

  const filteredData = data
    .filter((row) => {
      return (
        row?.companyName?.toLowerCase().includes(search.toLowerCase()) ||
        row?.role?.toLowerCase().includes(search.toLowerCase()) ||
        row?.email?.toLowerCase().includes(search.toLowerCase()) ||
        row?.phone?.toLowerCase().includes(search.toLowerCase())
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
  // const navigate = useNavigate();

  const particularTicket = (userId) => {
    navigate("/admin/particular-customer", {
      state: {
        row: userId,
      },
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

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Customers" breadcrumbItem="All Customers" />
          <Row>
            <Col xl={12}>
              <Card>
                <CardHeader className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="card-title">All Customers</h4>
                  </div>
                  <div>
                    <Input
                      type="text"
                      placeholder="Search..."
                      value={search}
                      onChange={handleSearch}
                      className="mr-2"
                    />
                  </div>
                </CardHeader>
                <Row>
                  <Col xl={12}>
                    <div className="table-settings">
                      <Link
                        to="/admin/add-customer"
                        className="me-2 btn btn-light"
                      >
                        <i className="dripicons-plus"></i>
                      </Link>
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
                                    ) // Filter based on selected rows
                                    .map((row) => ({
                                      companyName: row.companyName,
                                      role: row.role,
                                      email: row.email,
                                      phone: row.phone,
                                    }))
                                : data.map((row) => ({
                                    companyName: row.companyName,
                                    role: row.role,
                                    email: row.email,
                                    phone: row.phone,
                                  }))
                            }
                            headers={[
                              { label: "Company Name", key: "companyName" },
                              { label: "Category", key: "role" },
                              { label: "Email", key: "email" },
                              { label: "Mobile No", key: "phone" },
                            ]}
                            filename={"Customers.csv"}
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
                                      onChange={(e) =>
                                        handleColumnSearch(e, column.key)
                                      }
                                    />
                                  )}
                                </th>
                              )
                          )}
                          {/* {columnsVisibility.actions && <th></th>} */}
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
                                    key={column?.key}
                                    style={
                                      column.key === "companyName"
                                        ? {
                                            cursor: "pointer",
                                            textDecoration: "underline",
                                            color: "#ed8d21",
                                          }
                                        : {}
                                    }
                                    // onClick={() =>
                                    //   particularTicket(row?.userId)
                                    // }
                                  >
                                    {column.key === "status" ? (
                                      <span
                                        className={getStatusBadgeClass(
                                          row[column.key]
                                        )}
                                      >
                                        {row[column.key]}
                                      </span>
                                    ) : column.key === "assign" ? (
                                      // Condition for assign field with status check
                                      row.status === "created" ? (
                                        "Waiting for assign"
                                      ) : row.assign &&
                                        row.assign.length > 0 ? (
                                        row.assign[0]
                                      ) : (
                                        "Not assigned"
                                      )
                                    ) : column.key === "isVerified" ? (
                                      // Condition for assign field with status check
                                      row.isVerified === true ? (
                                        "Verified"
                                      ) : (
                                        "Not Verified"
                                      )
                                    ) : column.key === "companyName" ? (
                                      <Link
                                        to={`/admin/particular-customer`}
                                        state={row}
                                      >
                                        {row[column.key]}
                                      </Link>
                                    ) : (
                                      // Default rendering for other fields
                                      row[column.key]
                                    )}
                                  </td>
                                )
                            )}

                            {/* {columnsVisibility.actions && (
                              <td>
                                <DropdownComponent
                                  row={row}
                                  confirmDelete={confirmDelete}
                                />
                              </td>
                            )} */}
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
        <Modal isOpen={deleteModal} toggle={toggleDeleteModal}>
          <ModalHeader toggle={toggleDeleteModal}>Confirm Delete</ModalHeader>
          <ModalBody>
            Are you sure you want to delete this ticket {`${rowToDelete}`}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggleDeleteModal}>
              Cancel
            </Button>{" "}
            <Button color="danger" onClick={() => deleteTicket(rowToDelete)}>
              Delete
            </Button>{" "}
          </ModalFooter>
        </Modal>
      </div>
      <TicketModal
        isOpen={modalCenter}
        toggle={() => setModalCenter(!modalCenter)}
        ticketDetails={ticketDetails}
      />
    </DndProvider>
  );
};

const DropdownComponent = ({ row, confirmDelete }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const goToEditPage = (ticketData) => {
    navigate(`/customer/edit-ticket/${ticketData.ticketID}`, {
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

export default AllCustomerList;
