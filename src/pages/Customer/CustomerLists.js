import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
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
import "../../assets/scss/pages/table.scss";
import { toast } from "react-toastify";
import { getAPI } from "../../Services/Apis";

const CustomerLists = () => {
  const [data, setData] = useState([
    {
      id: 211,
      companyName: "JIO",
      email: "sanj.j@jio.com",
      contactNo: "+919890453245",
      location: "Pune",
    },
    {
      id: 432,
      companyName: "India One",
      email: "adsf.i@india1.com",
      contactNo: "+917890453245",
      location: "Hyderabad",
    },
    {
      id: 633,
      companyName: "APTS",
      email: "nidhi.a@apts.com",
      contactNo: "+919867453245",
      location: "Chennai",
    },
    {
      id: 214,
      companyName: "Trent",
      email: "vishal.m@trent.com",
      contactNo: "+919867453245",
      location: "Latur",
    },
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
    id: true,
    actions: true,
    userId: true,
    companyName: true,
    email: true,
    phone: true,
    location: true,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteModal, setDeleteModal] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [searchVisible, setSearchVisible] = useState({
    id: false,
    email: false,
    userId: true,
    companyName: true,
    email: true,
    phone: true,
    location: false,
  });

  const toggleExportDropdown = () => setExportDropdownOpen(!exportDropdownOpen);
  const toggleManageColumnsDropdown = () =>
    setManageColumnsDropdownOpen(!manageColumnsDropdownOpen);
  const toggleShowEntriesDropdown = () =>
    setShowEntriesDropdownOpen(!showEntriesDropdownOpen);
  const toggleDeleteModal = () => setDeleteModal(!deleteModal);

  useEffect(() => {
    getCustomerList();
  }, []);

  const getCustomerList = async () => {
    try {
      const response = await getAPI("user/get-customer-list");
      if (response.statusCode === 200) {
        // setData(response.data);
      }
    } catch (error) {
      // toast.error(error.message);
      console.log(error)
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const reorderedColumns = Array.from(columns);
    const [movedColumn] = reorderedColumns.splice(result.source.index, 1);
    reorderedColumns.splice(result.destination.index, 0, movedColumn);

    setColumns(reorderedColumns);
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
      case "In-Progress":
        return "badge bg-warning ";
      case "Cancel":
        return "badge bg-danger ";
      case "Done":
        return "badge bg-success ";
      default:
        return "badge bg-secondary";
    }
  };

  const handleSelectAllRows = () => {
    if (selectedRows.length === data.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(data.map((row) => row.id));
    }
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [
        ["Customer ID", "Company Name", "Email", "Contact No.", "Location"],
      ],
      body: selectedRows.length
        ? data
          .filter((row) => selectedRows.includes(row.id))
          .map((row) => [row.userId, row.companyName, row.email, row.phone])
        : data.map((row) => [
          row.userId,
          row.companyName,
          row.email,
          row.phone,
        ]),
    });
    doc.save("Customers.pdf");
  };

  const handleDelete = (id) => {
    setData(data.filter((row) => row.id !== id));
    toggleDeleteModal();
  };

  const confirmDelete = (id) => {
    setRowToDelete(id);
    toggleDeleteModal();
  };

  const filteredData = data
    .filter((row) => {
      return (
        row.userId?.toLowerCase().includes(search.toLowerCase()) ||
        row.companyName?.toLowerCase().includes(search.toLowerCase()) ||
        row.email?.toLowerCase().includes(search.toLowerCase()) ||
        row.location?.toLowerCase().includes(search.toLowerCase()) ||
        row.phone?.toLowerCase().includes(search.toLowerCase())
        // row.location.toLowerCase().includes(search.toLowerCase()) ||
        // row.contactNo.toLowerCase().includes(search.toLowerCase())
      );
    })
    .filter((row) => {
      return Object.keys(searchColumn).every((key) => {
        const value = row[key];
        return value !== undefined && value !== null
          ? value
            .toString()
            .toLowerCase()
            .includes(searchColumn[key].toLowerCase())
          : value;
      });
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

  const toggleSearch = (column) => {
    setSearchVisible((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
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
  const dragDropData = [
    {
      id: 1,
      title: "Company Name",
      desc: "companyName",
    },
    {
      id: 2,
      title: "Email",
      desc: "email",
    },
    {
      id: 3,
      title: "Mobile No.",
      desc: "phone",
    },
    {
      id: 4,
      title: "Location",
      desc: "location",
    },
  ];

  return (
    <div className="page-content">
      <div className="container-fluid">
        <Breadcrumbs title="Customer List" breadcrumbItem="All Customer" />
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
                    <Link to="/add-customer" className="me-2 btn btn-light">
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
                      <DropdownMenu end className="me-2">
                        <DropdownItem onClick={handleExportPDF}>
                          Export to PDF
                        </DropdownItem>
                        <CSVLink
                          data={
                            selectedRows.length
                              ? data.filter((row) =>
                                selectedRows.includes(row.id)
                              )
                              : data
                          }
                          filename={"table.csv"}
                        >
                          <DropdownItem>Export to CSV</DropdownItem>
                        </CSVLink>
                      </DropdownMenu>
                    </Dropdown>
                    {/* <Dropdown isOpen={manageColumnsDropdownOpen} toggle={toggleManageColumnsDropdown} className="d-inline-block me-2">
                                    <DropdownToggle caret>
                                        <i className="dripicons-scale"></i>
                                    </DropdownToggle>
                                    <DropdownMenu right>
                                        <DropdownItem toggle={false}>
                                            <Input type="checkbox" checked={Object.values(columnsVisibility).every(v => v)} onChange={handleSelectAllColumns} /> Select All
                                        </DropdownItem>
                                        {Object.keys(columnsVisibility).map(col => (
                                            <DropdownItem key={col} toggle={false}>
                                                <Input type="checkbox" checked={columnsVisibility[col]} onChange={() => setColumnsVisibility({ ...columnsVisibility, [col]: !columnsVisibility[col] })} /> {col}
                                            </DropdownItem>
                                        ))}
                                    </DropdownMenu>
                                </Dropdown> */}
                  </div>
                </Col>
              </Row>
              <CardBody>
                <div className="table-responsive">
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Table className="table mb-0">
                      <thead className="table-light">
                        <Droppable droppableId="columns" direction="horizontal">
                          {(provided) => (
                            <tr
                              style={{ textAlign: "center" }}
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                            >
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
                                      {Object.keys(columnsVisibility).map(
                                        (col) => (
                                          <DropdownItem
                                            key={col}
                                            toggle={false}
                                          >
                                            <Input
                                              type="checkbox"
                                              checked={columnsVisibility[col]}
                                              onChange={() =>
                                                setColumnsVisibility({
                                                  ...columnsVisibility,
                                                  [col]:
                                                    !columnsVisibility[col],
                                                })
                                              }
                                            />{" "}
                                            {col}
                                          </DropdownItem>
                                        )
                                      )}
                                    </DropdownMenu>
                                  </Dropdown>
                                </span>
                                <Input
                                  type="checkbox"
                                  onChange={handleSelectAllRows}
                                  checked={selectedRows.length === data.length}
                                />
                              </th>

                              {columnsVisibility.id && (
                                <th>
                                  Customer ID{" "}
                                  <span
                                    style={{
                                      cursor: "pointer",
                                      opacity: "0.5",
                                    }}
                                    onClick={() => sortData("id")}
                                  >
                                    {getIcon("id")}
                                  </span>
                                </th>
                              )}

                              {dragDropData.map(
                                (column, index) =>
                                  columnsVisibility[column.desc] && (
                                    <Draggable
                                      key={column.id}
                                      draggableId={column.id}
                                      index={index}
                                    >
                                      {(provided) => (
                                        <th
                                        // ref={provided.innerRef}
                                        // {...provided.draggableProps}
                                        // {...provided.dragHandleProps}
                                        >
                                          {console.log("column======", column)}
                                          {column.title}
                                          {/* <span style={{ cursor: 'pointer', opacity: '0.5' }}
                                                                                    onClick={() => sortData(`{column.desc}`)}>{getIcon(`{column.desc}`)}</span> */}
                                        </th>
                                      )}
                                    </Draggable>
                                  )
                              )}

                              {columnsVisibility.location && <th>Location</th>}
                              {columnsVisibility.actions && <th>Actions</th>}
                              {provided.placeholder}
                            </tr>
                          )}
                        </Droppable>
                      </thead>

                      <tbody>
                        <tr>
                          <td></td>
                          {columnsVisibility.id && (
                            <td>
                              <Input
                                type="text"
                                style={{ height: "30px", width: "125px" }}
                                placeholder="Search"
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => handleColumnSearch(e, "id")}
                              />
                            </td>
                          )}
                          {columnsVisibility.companyName && (
                            <td>
                              {" "}
                              <Input
                                type="text"
                                style={{ height: "30px", width: "125px" }}
                                placeholder="Search"
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) =>
                                  handleColumnSearch(e, "companyName")
                                }
                              />
                            </td>
                          )}
                          {columnsVisibility.email && (
                            <td>
                              {" "}
                              <Input
                                type="text"
                                style={{ height: "30px", width: "125px" }}
                                placeholder="Search"
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => handleColumnSearch(e, "email")}
                              />
                            </td>
                          )}
                          {columnsVisibility.phone && (
                            <td>
                              {" "}
                              <Input
                                type="text"
                                style={{ height: "30px", width: "125px" }}
                                placeholder="Search"
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => handleColumnSearch(e, "phone")}
                              />
                            </td>
                          )}
                          {columnsVisibility.location && (
                            <td>
                              {" "}
                              <Input
                                type="text"
                                style={{ height: "30px", width: "125px" }}
                                placeholder="Search"
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) =>
                                  handleColumnSearch(e, "location")
                                }
                              />
                            </td>
                          )}
                          {/* {columnsVisibility.contactNo && (
                            <td>
                              {" "}
                              <Input
                                type="text"
                                style={{ height: "30px", width: "125px" }}
                                placeholder="Search"
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) =>
                                  handleColumnSearch(e, "contactNo")
                                }
                              />
                            </td>
                          )} */}
                        </tr>
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
                            {columnsVisibility.userId && <td>{row.userId}</td>}
                            {columnsVisibility.companyName && (
                              <td>{row.companyName}</td>
                            )}
                            {columnsVisibility.email && <td>{row.email}</td>}
                            {columnsVisibility.phone && <td>{row.phone}</td>}
                            {columnsVisibility.contactNo && (
                              <td>{row.contactNo}</td>
                            )}
                            {columnsVisibility.location && (
                              <td>{row.location}</td>
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
                  </DragDropContext>
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
                    <DropdownMenu end>
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
        <ModalBody>Are you sure you want to delete this record?</ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleDeleteModal}>
            Cancel
          </Button>
          <Button color="danger" onClick={() => handleDelete(rowToDelete)}>
            Delete
          </Button>{" "}

        </ModalFooter>
      </Modal>
    </div>
  );
};
const DropdownComponent = ({ row, confirmDelete }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const navigate = useNavigate();

  const goToEditPage = (customerData) => {
    navigate(`/admin/edit-customer/${customerData.userId}`, {
      state: {
        row: customerData,
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
        <DropdownItem onClick={() => confirmDelete(row.id)}>
          Delete
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default CustomerLists;

//   {
//     columnsVisibility.companyName && (
//         <th
//             ref={provided.innerRef}
//             {...provided.draggableProps}
//             {...provided.dragHandleProps}
//             onClick={() => toggleSearch('companyName')}>
//             Company Name <span style={{ cursor: 'pointer', opacity: '0.5' }} onClick={() => sortData('companyName')}>{getIcon('companyName')}</span>

//         </th>
//     )
// }

// {columnsVisibility.email && (
//     <th onClick={() => toggleSearch('email')}>
//         Email  <span style={{ cursor: 'pointer', opacity: '0.5' }} onClick={() => sortData('email')}>{getIcon('email')}</span>
//     </th>
// )}

// {columnsVisibility.contactNo && (
//     <th onClick={() => toggleSearch('contactNo')}>
//         Contact No <span style={{ cursor: 'pointer', opacity: '0.5' }} onClick={() => sortData('contactNo')}>{getIcon('contactNo')}</span>

//     </th>
// )}

// {columnsVisibility.location && (
//     <th onClick={() => toggleSearch('location')}>
//         Location <span style={{ cursor: 'pointer', opacity: '0.5' }} onClick={() => sortData('location')}>{getIcon('location')}</span>
//     </th>
// )}
