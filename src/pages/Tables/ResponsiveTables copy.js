import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Form,
  Button,
} from "reactstrap";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { tabledata } from "../../common/data"; // Adjust the path as per your data source
import jsPDF from "jspdf";
import "jspdf-autotable";
import CustomPagination from "./CustomerPagination"; // Adjust the path as per your project structure

const ResponsiveTables = () => {
  document.title =
    "Responsive Table | Minia - React Admin & Dashboard Template";

  const [selectedRows, setSelectedRows] = useState([]);
  const [actionIndex, setActionIndex] = useState(null);
  const [visibleColumns, setVisibleColumns] = useState({
    company: true,
    lastTrade: true,
    tradeTime: true,
    change: true,
    prevClose: true,
    open: true,
    bid: true,
    ask: true,
    targetEst: true,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // or 'edit'
  const [formData, setFormData] = useState({
    ticker: "",
    companyName: "",
    price: "",
    time: "",
    change: "",
    low: "",
    high: "",
    bidQuantity: "",
    askQuantity: "",
    volume: "",
  });

  // Update filteredRows whenever searchQuery or tabledata changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredRows([]);
    } else {
      const query = searchQuery.trim().toLowerCase();
      const filtered = tabledata.filter(
        (row) =>
          row.ticker.toLowerCase().includes(query) ||
          row.companyName.toLowerCase().includes(query) ||
          row.price.toString().includes(query) ||
          row.time.toString().includes(query) ||
          row.change.toString().includes(query) ||
          row.low.toString().includes(query) ||
          row.high.toString().includes(query) ||
          row.bidQuantity.toString().includes(query) ||
          row.askQuantity.toString().includes(query) ||
          row.volume.toString().includes(query)
      );
      setFilteredRows(filtered);
    }
  }, [searchQuery, tabledata]);

  const handleSelectAll = (event) => {
    if (selectedRows.length === tabledata.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(tabledata.map((_, index) => index));
    }
  };

  const handleSelectRow = (index) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(index)) {
        return prevSelectedRows.filter((rowIndex) => rowIndex !== index);
      } else {
        return [...prevSelectedRows, index];
      }
    });
  };

  const isSelected = (index) => selectedRows.includes(index);

  const handleActionToggle = (index) => {
    setActionIndex(index === actionIndex ? null : index);
  };

  const handleEdit = (index) => {
    setModalMode("edit");
    setActionIndex(null);
    // Determine the correct rowData to edit
    const rowData = filteredRows.length > 0 ? filteredRows[index] : tabledata[index];
    // Populate the form fields with existing data
    setFormData({
      ticker: rowData.ticker,
      companyName: rowData.companyName,
      price: rowData.price,
      time: rowData.time,
      change: rowData.change,
      low: rowData.low,
      high: rowData.high,
      bidQuantity: rowData.bidQuantity,
      askQuantity: rowData.askQuantity,
      volume: rowData.volume,
    });
    toggleModal();
  };

  const handleDelete = (index) => {
    setActionIndex(null);
    // Implement your delete logic here
  };

  const handleDownloadPDF = (index) => {
    setActionIndex(null);
    const doc = new jsPDF();
    // Determine the correct rowData to download as PDF
    const rowData = filteredRows.length > 0 ? filteredRows[index] : tabledata[index];

    const headers = Object.keys(rowData);
    const data = [headers.map((header) => rowData[header])];

    doc.autoTable({
      head: [headers],
      body: data,
    });

    doc.save(`${rowData.ticker || 'record'}_details.pdf`);
  };

  const toggleColumnVisibility = (columnName) => {
    setVisibleColumns((prevVisibleColumns) => ({
      ...prevVisibleColumns,
      [columnName]: !prevVisibleColumns[columnName],
    }));
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = searchQuery.trim()
    ? filteredRows.slice(indexOfFirstRow, indexOfLastRow)
    : tabledata.slice(indexOfFirstRow, indexOfLastRow);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setModalMode("add"); // Reset modal mode to 'add' when closing
    setFormData({
      ticker: "",
      companyName: "",
      price: "",
      time: "",
      change: "",
      low: "",
      high: "",
      bidQuantity: "",
      askQuantity: "",
      volume: "",
    });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (modalMode === "add") {
      // Add logic
      tabledata.push(formData); // Modify as per your data structure
    } else if (modalMode === "edit") {
      // Edit logic
      const index = filteredRows.length > 0 ? tabledata.indexOf(filteredRows[actionIndex]) : actionIndex;
      tabledata[index] = formData; // Modify as per your data structure
    }
    toggleModal();
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Tables" breadcrumbItem="Responsive Table" />

          <Row className="mb-3">
            <Col>
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <Card>
                <CardHeader>
                  <h4 className="card-title">Example</h4>
                  <p className="card-title-desc">
                    This is an experimental awesome solution for responsive
                    tables with complex data.
                  </p>
                  <ButtonDropdown
                    isOpen={actionIndex === -1}
                    toggle={() => handleActionToggle(-1)}
                  >
                    <DropdownToggle caret color="primary" size="sm">
                      Manage Columns
                    </DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem header>
                        Select columns to display:
                      </DropdownItem>
                      <DropdownItem divider />
                      <DropdownItem>
                        <input
                          type="checkbox"
                          checked={visibleColumns.company}
                          onChange={() => toggleColumnVisibility("company")}
                        />{" "}
                        Company
                      </DropdownItem>
                      <DropdownItem>
                        <input
                          type="checkbox"
                          checked={visibleColumns.lastTrade}
                          onChange={() => toggleColumnVisibility("lastTrade")}
                        />{" "}
                        Last Trade
                      </DropdownItem>
                      <DropdownItem>
                        <input
                          type="checkbox"
                          checked={visibleColumns.tradeTime}
                          onChange={() => toggleColumnVisibility("tradeTime")}
                        />{" "}
                        Trade Time
                      </DropdownItem>
                      <DropdownItem>
                        <input
                          type="checkbox"
                          checked={visibleColumns.change}
                          onChange={() => toggleColumnVisibility("change")}
                        />{" "}
                        Change
                      </DropdownItem>
                      <DropdownItem>
                        <input
                          type="checkbox"
                          checked={visibleColumns.prevClose}
                          onChange={() => toggleColumnVisibility("prevClose")}
                        />{" "}
                        Prev Close
                      </DropdownItem>
                      <DropdownItem>
                        <input
                          type="checkbox"
                          checked={visibleColumns.open}
                          onChange={() => toggleColumnVisibility("open")}
                        />{" "}
                        Open
                      </DropdownItem>
                      <DropdownItem>
                        <input
                          type="checkbox"
                          checked={visibleColumns.bid}
                          onChange={() => toggleColumnVisibility("bid")}
                        />{" "}
                        Bid
                      </DropdownItem>
                      <DropdownItem>
                        <input
                          type="checkbox"
                          checked={visibleColumns.ask}
                          onChange={() => toggleColumnVisibility("ask")}
                        />{" "}
                        Ask
                      </DropdownItem>
                      <DropdownItem>
                        <input
                          type="checkbox"
                          checked={visibleColumns.targetEst}
                          onChange={() => toggleColumnVisibility("targetEst")}
                        />{" "}
                        1y Target Est
                      </DropdownItem>
                    </DropdownMenu>
                  </ButtonDropdown>
                  <Button
                    color="success"
                    className="float-end"
                    onClick={() => {
                      setModalMode("add");
                      toggleModal();
                    }}
                  >
                    Add Customer
                  </Button>

                  <Row>
            <Col lg="12">
              <Row className="align-items-center">
                <Col md={6}>
                  <div className="mb-3">
                    <h5 className="card-title">
                      Customer List{" "}
                      <span className="text-muted fw-normal ms-2">(834)</span>
                    </h5>
                  </div>
                </Col>

                <Col md={6}>
                  <div className="d-flex flex-wrap align-items-center justify-content-end gap-2 mb-3">
                    <div>
                      <ul className="nav nav-pills">
                        <li className="nav-item">
                          <NavLink href="/contacts-list" data-bs-toggle="tooltip"  data-bs-placement="top" id="list">
                            <i className="bx bx-list-ul"></i>
                            <UncontrolledTooltip placement="top" target="list"> List</UncontrolledTooltip>
                          </NavLink>
                        </li>
                        <li className="nav-item">
                          <NavLink className="active" href="/contacts-grid"  data-bs-toggle="tooltip" data-bs-placement="top" id="grid"  >
                            <i className="bx bx-grid-alt"></i>
                            <UncontrolledTooltip placement="top" target="grid">
                              Grid
                            </UncontrolledTooltip>
                          </NavLink>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <Link to="#" className="btn btn-light" onClick={handleUserClicks}>
                        <i className="bx bx-plus me-1"></i> Add New
                      </Link>
                    </div>

                    <UncontrolledDropdown>
                      <DropdownToggle className="btn btn-link text-muted py-1 font-size-16 shadow-none" tag="a" >
                        <i className="bx bx-dots-horizontal-rounded"></i>
                      </DropdownToggle>
                      <DropdownMenu className="dropdown-menu-end">
                        <li><DropdownItem to="#">Action</DropdownItem></li>
                        <li><DropdownItem to="#">Another action</DropdownItem></li>
                        <li><DropdownItem to="#">Something else here</DropdownItem></li>
                      </DropdownMenu>
                    </UncontrolledDropdown>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col xl="12">
                  <TableContainer
                    columns={columns}
                    data={users}
                    isGlobalFilter={true}
                    isAddUserList={true}
                    customPageSize={10}
                    className="table align-middle datatable dt-responsive table-check nowrap"
                  />

                  <Modal isOpen={modal} toggle={toggle}>
                    <ModalHeader toggle={toggle} tag="h4">
                      {!!isEdit ? "Edit User" : "Add User"}
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
                            <div className="mb-3">
                              <Label className="form-label">Name</Label>
                              <Input
                                name="name"
                                type="text"
                                placeholder="Insert Name"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.name || ""}
                                invalid={
                                  validation.touched.name &&
                                    validation.errors.name
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.name &&
                                validation.errors.name ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.name}
                                </FormFeedback>
                              ) : null}
                            </div>
                            <div className="mb-3">
                              <Label className="form-label">
                                Designation
                              </Label>
                              <Input
                                name="designation"
                                label="Designation"
                                type="text"
                                placeholder="Insert Designation"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.designation || ""}
                                invalid={
                                  validation.touched.designation &&
                                    validation.errors.designation
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.designation &&
                                validation.errors.designation ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.designation}
                                </FormFeedback>
                              ) : null}
                            </div>
                            <div className="mb-3">
                              <Label className="form-label">Email</Label>
                              <Input
                                name="email"
                                label="Email"
                                type="email"
                                placeholder="Insert Email"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.email || ""}
                                invalid={
                                  validation.touched.email &&
                                    validation.errors.email
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.email &&
                                validation.errors.email ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.email}
                                </FormFeedback>
                              ) : null}
                            </div>
                            <div className="mb-3">
                              <Label className="form-label">Option</Label>
                              <Input
                                type="select"
                                name="tags"
                                className="form-select"
                                placeholder="Insert Option"
                                multiple={true}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.tags || []}
                                invalid={
                                  validation.touched.tags &&
                                    validation.errors.tags
                                    ? true
                                    : false
                                }
                              >
                                <option>Photoshop</option>
                                <option>illustrator</option>
                                <option>Html</option>
                                <option>Php</option>
                                <option>Java</option>
                                <option>Python</option>
                                <option>UI/UX Designer</option>
                                <option>Ruby</option>
                                <option>Css</option>
                              </Input>
                              {validation.touched.tags &&
                                validation.errors.tags ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.tags}
                                </FormFeedback>
                              ) : null}
                            </div>
                            <div className="mb-3">
                              <Label className="form-label">Projects</Label>
                              <Input
                                name="projects"
                                label="Projects"
                                type="text"
                                placeholder="Insert Project"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.projects || ""}
                                invalid={
                                  validation.touched.projects &&
                                    validation.errors.projects
                                    ? true
                                    : false
                                }
                              />
                              {validation.touched.projects &&
                                validation.errors.projects ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.projects}
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
                </Col>
              </Row>
            </Col>
          </Row>
                </CardHeader>
                <CardBody>
                  <div className="table-rep-plugin">
                    <div
                      className="table-responsive mb-0"
                      data-pattern="priority-columns"
                    >
                      <Table className="table table-striped table-bordered">
                        <Thead>
                          <Tr>
                            <Th>
                              <input
                                type="checkbox"
                                onChange={handleSelectAll}
                                checked={
                                  selectedRows.length === currentRows.length
                                }
                              />
                              
                            </Th>
                            {visibleColumns.company && <Th>Company</Th>}
                            {visibleColumns.lastTrade && (
                              <Th data-priority="1">Last Trade</Th>
                            )}
                            {visibleColumns.tradeTime && (
                              <Th data-priority="3">Trade Time</Th>
                            )}
                            {visibleColumns.change && (
                              <Th data-priority="1">Change</Th>
                            )}
                            {visibleColumns.prevClose && (
                              <Th data-priority="3">Prev Close</Th>
                            )}
                            {visibleColumns.open && (
                              <Th data-priority="3">Open</Th>
                            )}
                            {visibleColumns.bid && <Th data-priority="6">Bid</Th>}
                            {visibleColumns.ask && <Th data-priority="6">Ask</Th>}
                            {visibleColumns.targetEst && (
                              <Th data-priority="6">1y Target Est</Th>
                            )}
                            <Th>Actions</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {currentRows.map((rowData, index) => (
                            <Tr key={index}>
                              <Td>
                                <input
                                  type="checkbox"
                                  checked={isSelected(index)}
                                  onChange={() => handleSelectRow(index)}
                                />
                              </Td>
                              {visibleColumns.company && (
                                <Td>
                                  {rowData.ticker}{" "}
                                  <span className="co-name">
                                    {rowData.companyName}
                                  </span>
                                </Td>
                              )}
                              {visibleColumns.lastTrade && (
                                <Td>{rowData.price}</Td>
                              )}
                              {visibleColumns.tradeTime && <Td>{rowData.time}</Td>}
                              {visibleColumns.change && <Td>{rowData.change}</Td>}
                              {visibleColumns.prevClose && <Td>{rowData.low}</Td>}
                              {visibleColumns.open && <Td>{rowData.high}</Td>}
                              {visibleColumns.bid && (
                                <Td>{rowData.bidQuantity}</Td>
                              )}
                              {visibleColumns.ask && (
                                <Td>{rowData.askQuantity}</Td>
                              )}
                              {visibleColumns.targetEst && <Td>{rowData.volume}</Td>}
                              <Td>
                                <ButtonDropdown
                                  isOpen={actionIndex === index}
                                  toggle={() => handleActionToggle(index)}
                                >
                                  <DropdownToggle
                                    caret
                                    color="primary"
                                    size="sm"
                                  >
                                    ...
                                  </DropdownToggle>
                                  <DropdownMenu>
                                    <DropdownItem onClick={() => handleEdit(index)}>
                                      Edit
                                    </DropdownItem>
                                    <DropdownItem onClick={() => handleDelete(index)}>
                                      Delete
                                    </DropdownItem>
                                    <DropdownItem onClick={() => handleDownloadPDF(index)}>
                                      Download PDF
                                    </DropdownItem>
                                  </DropdownMenu>
                                </ButtonDropdown>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Pagination component */}
          <Row className="mt-3">
            <Col>
              <CustomPagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalItems={searchQuery.trim() ? filteredRows.length : tabledata.length}
                itemsPerPage={rowsPerPage}
              />
            </Col>
          </Row>

          {/* Add/Edit Modal */}
          <Modal isOpen={isModalOpen} toggle={toggleModal}>
            <Form onSubmit={handleSubmit}>
              <ModalHeader toggle={toggleModal}>
                {modalMode === "add" ? "Add New Customer" : "Edit Customer"}
              </ModalHeader>
              <ModalBody>
                <FormGroup>
                  <Label for="ticker">Ticker</Label>
                  <Input
                    type="text"
                    id="ticker"
                    name="ticker"
                    value={formData.ticker}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="companyName">Company Name</Label>
                  <Input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="price">Price</Label>
                  <Input
                    type="text"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="time">Time</Label>
                  <Input
                    type="text"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="change">Change</Label>
                  <Input
                    type="text"
                    id="change"
                    name="change"
                    value={formData.change}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="low">Low</Label>
                  <Input
                    type="text"
                    id="low"
                    name="low"
                    value={formData.low}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="high">High</Label>
                  <Input
                    type="text"
                    id="high"
                    name="high"
                    value={formData.high}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="bidQuantity">Bid Quantity</Label>
                  <Input
                    type="text"
                    id="bidQuantity"
                    name="bidQuantity"
                    value={formData.bidQuantity}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="askQuantity">Ask Quantity</Label>
                  <Input
                    type="text"
                    id="askQuantity"
                    name="askQuantity"
                    value={formData.askQuantity}
                    onChange={handleInputChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="volume">Volume</Label>
                  <Input
                    type="text"
                    id="volume"
                    name="volume"
                    value={formData.volume}
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" type="submit">
                  {modalMode === "add" ? "Add" : "Update"}
                </Button>{" "}
                <Button color="secondary" onClick={toggleModal}>
                  Cancel
                </Button>
              </ModalFooter>
            </Form>
          </Modal>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ResponsiveTables;
