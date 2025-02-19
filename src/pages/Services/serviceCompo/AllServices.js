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
import { getAPI, postAPI } from "../../../Services/Apis";
import { toast } from "react-toastify";
import moment from "moment/moment";
import { getUserDetails } from "../../../common/utility";

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

const AllServices = () => {
  const [data, setData] = useState([]);

  const [columns, setColumns] = useState([
    { key: "serviceName", label: "Service Name" },
    { key: "category", label: "Category" },
    { key: "description", label: "Description" },
    { key: "price", label: "Price" },
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
    serviceName: true,
    category: true,
    description: true,
    price: true,
    actions: true,
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
    getAllService();
  }, []);

  const getAllService = async () => {
    try {
      const response = await getAPI("service/get-service");
      console.log(response);
      if (response.statusCode === 200) {
        setData(response.data);
        console.log(response.data);
      }
    } catch (error) {
      // toast.error(error.message);
      console.log(error);
    }
  };

  const deleteSite = async () => {
    try {
      const data = { serviceID: rowToDelete };
      console.log(data);
      const response = await postAPI("service/delete-service", data);
      if (response.statusCode === 200) {
        toast.success(response.message);
        getAllService();
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
      case "In-Progress":
        return "badge bg-warning ";
      case "Cancel":
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
      head: [["serviceName", "category", "description", "price"]],
      body: selectedRows.length
        ? data
          .filter((row) => selectedRows.includes(row?._id))
          .map((row) => [
            //   row?.siteID,
            row?.serviceName,
            row?.category,
            row?.description,
            row?.price,
          ])
        : data.map((row) => [
          // row?.siteID,
          row?.serviceName,
          row?.category,
          row?.description,
          row?.price,
        ]),
    });
    doc.save("Services.pdf");
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
        row.price.toLowerCase().includes(search.toLowerCase()) ||
        row.serviceName.toLowerCase().includes(search.toLowerCase()) ||
        row.description.toLowerCase().includes(search.toLowerCase()) ||
        row.category.toLowerCase().includes(search.toLowerCase())
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
  console.log(paginatedData);
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

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Services" breadcrumbItem="All Services" />
          <Row>
            <Col xl={12}>
              <Card>
                <CardHeader className="d-flex justify-content-between align-items-center">
                  <div>
                    <h4 className="card-title">All Services</h4>
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
                        to="/admin/add-service"
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
                                    serviceName: row.serviceName,
                                    category: row.category,
                                    description: row.description,
                                    price: row.price,
                                  }))
                                : data.map((row) => ({
                                  serviceName: row.serviceName,
                                  category: row.category,
                                  description: row.description,
                                  price: row.price,
                                }))
                            }
                            headers={[
                              { label: "Service Name", key: "serviceName" },
                              { label: "Category", key: "category" },
                              { label: "Description", key: "description" },
                              { label: "Price", key: "price" },
                            ]}
                            filename={"Services.csv"}
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
                          {columnsVisibility.actions && <th></th>}
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
                                  <td key={column.key}>{row[column.key]}</td>
                                )
                            )}

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
            Are you sure you want to delete this Site {`${rowToDelete}`}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggleDeleteModal}>
              Cancel
            </Button>
            <Button color="danger" onClick={() => deleteSite(rowToDelete)}>
              Delete
            </Button>{" "}

          </ModalFooter>
        </Modal>
      </div>
    </DndProvider>
  );
};
const DropdownComponent = ({ row, confirmDelete }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const navigate = useNavigate();

  const goToEditPage = (siteData) => {
    console.log(siteData);
    navigate(`/admin/update-service/${siteData.serviceID}`, {
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
        <DropdownItem onClick={() => confirmDelete(row.serviceID)}>
          Delete
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default AllServices;
