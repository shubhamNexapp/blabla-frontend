import React, { useState, useCallback, useEffect } from "react";

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
import { postAPI } from "../../Services/Apis";
import { toast } from "react-toastify";
import { getUserDetails } from "../../common/utility";
import loader from "../../assets/images/instaone-loader.svg";
import { LoaderHide, LoaderShow } from "../../helpers/common_constants";
import Switch from "@mui/material/Switch";

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
const AdminHelpList = () => {
  const [data, setData] = useState([]);
  const loginUser = getUserDetails();
  const [columns, setColumns] = useState([
    // { key: "customerName", label: "Customer Name" },
    { key: "helpDescription", label: "Description" },
    { key: "isComplaintAgainstEngineer", label: "Engineer" },
    { key: "isComplaintAgainstCustomer", label: "Customer" },
    { key: "isComplaintAgainstInstaOne", label: "INSTAONE" },
    { key: "isHelpCompleted", label: "Status" },
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
    // customerName: true,
    helpDescription: true,
    isComplaintAgainstEngineer: true,
    isComplaintAgainstCustomer: true,
    isComplaintAgainstInstaOne: true,
    isHelpCompleted: true,
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
      const response = await postAPI("help/get-help");
      if (response.statusCode === 200) {
        LoaderHide();
        setData(response?.data);
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
      case "TRUE":
        return "badge bg-success ";
      case "FALSE":
        return "badge bg-danger ";
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
          // "Customer Name",
          "Description",
          "Engineer",
          "Customer",
          "INSTAONE",
          "Status",
        ],
      ],
      body: selectedRows.length
        ? data
            .filter((row) => selectedRows.includes(row._id))
            .map((row) => [
              // row?.customerName,
              row?.helpDescription,
              row?.isComplaintAgainstEngineer,
              row?.isComplaintAgainstCustomer,
              row?.isComplaintAgainstInstaOne,
              row?.isHelpCompleted,
            ])
        : data.map((row) => [
            // row?.customerName,
            row?.helpDescription,
            row?.isComplaintAgainstEngineer,
            row?.isComplaintAgainstCustomer,
            row?.isComplaintAgainstInstaOne,
            row?.isHelpCompleted,
          ]),
    });
    doc.save("complaints.pdf");
  };

  const filteredData = data
    .filter((row) => {
      return (
        // row?.customerName?.toLowerCase().includes(search.toLowerCase()) ||
        row?.helpDescription.toLowerCase().includes(search.toLowerCase())
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

  const moveColumn = useCallback(
    (dragIndex, hoverIndex) => {
      const newColumns = [...columns];
      const [draggedColumn] = newColumns.splice(dragIndex, 1);
      newColumns.splice(hoverIndex, 0, draggedColumn);
      setColumns(newColumns);
    },
    [columns]
  );

  const handleToggleHelpCompletion = async (helpId, newValue) => {
    if (newValue === true) {
      try {
        LoaderShow();
        const response = await postAPI("help/update-help-status", {
          helpId,
          isHelpCompleted: newValue,
        });

        if (response.statusCode === 200) {
          toast.success("Help completion status updated");
          getTicketDetails();
          LoaderHide();
        }
      } catch (error) {
        LoaderHide();
        toast.error("An error occurred while updating the status");
      }
    } else {
      LoaderHide();
      toast.error("This complaint is already resolved and cannot be changed");
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Complaints" breadcrumbItem="All Complaints" />
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
                <CardHeader className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="card-title">All Complaints</h4>
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
                                    .filter((row) =>
                                      selectedRows.includes(row._id)
                                    ) // Filter based on selected rows
                                    .map(
                                      ({
                                        isComplaintAgainstCustomer,
                                        customerName,
                                        isComplaintAgainstInstaOne,
                                        isComplaintAgainstEngineer,
                                        isHelpCompleted,
                                        helpDescription,
                                      }) => ({
                                        isComplaintAgainstCustomer,
                                        customerName,
                                        isComplaintAgainstInstaOne,
                                        isComplaintAgainstEngineer,
                                        isHelpCompleted,
                                        helpDescription,
                                      })
                                    )
                                : data.map(
                                    ({
                                      isComplaintAgainstCustomer,
                                      customerName,
                                      isComplaintAgainstInstaOne,
                                      isComplaintAgainstEngineer,
                                      isHelpCompleted,
                                      helpDescription,
                                    }) => ({
                                      isComplaintAgainstCustomer,
                                      customerName,
                                      isComplaintAgainstInstaOne,
                                      isComplaintAgainstEngineer,
                                      isHelpCompleted,
                                      helpDescription,
                                    })
                                  )
                            }
                            headers={[
                              {
                                label: "Complaint Against Customer",
                                key: "isComplaintAgainstCustomer",
                              },
                              { label: "Customer Name", key: "customerName" },
                              { label: "Description", key: "helpDescription" },
                              {
                                label: "Complaint Against InstaOne",
                                key: "isComplaintAgainstInstaOne",
                              },
                              {
                                label: "Complaint Against Engineer",
                                key: "isComplaintAgainstEngineer",
                              },
                              {
                                label: "Help Completed",
                                key: "isHelpCompleted",
                              },
                            ]}
                            filename={"Help-Data.csv"}
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
                        {paginatedData?.map((row) => (
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
                                  <td key={column.key}>
                                    {/* Handle the custom display logic for complaint columns */}
                                    {column.key ===
                                    "isComplaintAgainstEngineer" ? (
                                      row.isComplaintAgainstEngineer ? (
                                        <span
                                          className={getStatusBadgeClass(
                                            "TRUE"
                                          )}
                                        >
                                          TRUE
                                        </span>
                                      ) : (
                                        <span
                                          className={getStatusBadgeClass(
                                            "FALSE"
                                          )}
                                        >
                                          FALSE
                                        </span>
                                      )
                                    ) : column.key ===
                                      "isComplaintAgainstInstaOne" ? (
                                      row.isComplaintAgainstInstaOne ? (
                                        <span
                                          className={getStatusBadgeClass(
                                            "TRUE"
                                          )}
                                        >
                                          TRUE
                                        </span>
                                      ) : (
                                        <span
                                          className={getStatusBadgeClass(
                                            "FALSE"
                                          )}
                                        >
                                          FALSE
                                        </span>
                                      )
                                    ) : column.key ===
                                      "isComplaintAgainstInstaOne" ? (
                                      row.isComplaintAgainstInstaOne ? (
                                        <span
                                          className={getStatusBadgeClass(
                                            "TRUE"
                                          )}
                                        >
                                          TRUE
                                        </span>
                                      ) : (
                                        <span
                                          className={getStatusBadgeClass(
                                            "FALSE"
                                          )}
                                        >
                                          FALSE
                                        </span>
                                      )
                                    ) : column.key ===
                                      "isComplaintAgainstCustomer" ? (
                                      row.isComplaintAgainstCustomer ? (
                                        <span
                                          className={getStatusBadgeClass(
                                            "TRUE"
                                          )}
                                        >
                                          TRUE
                                        </span>
                                      ) : (
                                        <span
                                          className={getStatusBadgeClass(
                                            "FALSE"
                                          )}
                                        >
                                          FALSE
                                        </span>
                                      )
                                    ) : column.key === "isHelpCompleted" ? (
                                      // Toggle switch for isHelpCompleted
                                      <Switch
                                        checked={row?.isHelpCompleted} // Show switch as ON if isHelpCompleted is true
                                        onChange={() =>
                                          handleToggleHelpCompletion(
                                            row._id,
                                            !row?.isHelpCompleted
                                          )
                                        } // Toggle function
                                      />
                                    ) : (
                                      row[column.key] // Default behavior for other columns
                                    )}
                                  </td>
                                )
                            )}
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
      </div>
    </DndProvider>
  );
};

export default AdminHelpList;
