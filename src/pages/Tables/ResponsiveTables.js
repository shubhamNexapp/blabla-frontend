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
  const [searchQuery, setSearchQuery] = useState("");
  const [columnSearchQuery, setColumnSearchQuery] = useState({
    "Ticket ID": "",
    Progress: "",
    "Site Address": "",
    City: "",
    "Contact Number": "",
    "Tracking Details": "",
    "Execution Date": "",
  });
  const [filteredRows, setFilteredRows] = useState([]);
  const [visibleSearchInputs, setVisibleSearchInputs] = useState({
    "Ticket ID": false,
    Progress: false,
    "Site Address": false,
    City: false,
    "Contact Number": false,
    "Tracking Details": false,
    "Execution Date": false,
  });
  const [visibleColumns, setVisibleColumns] = useState({
    "Ticket ID": true,
    Progress: true,
    "Site Address": true,
    City: true,
    "Contact Number": true,
    "Tracking Details": true,
    "Execution Date": true,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // or 'edit'
  const [formData, setFormData] = useState({
    "Ticket ID": "",
    Progress: "",
    "Site Address": "",
    City: "",
    "Contact Number": "",
    "Tracking Details": "",
    "Execution Date": "",
  });
  const [actionIndex, setActionIndex] = useState(null);

  // Update filteredRows whenever searchQuery or tabledata changes
  useEffect(() => {
    const filterRows = () => {
      let filtered = tabledata;

      if (searchQuery?.trim()) {
        const query = searchQuery.trim().toLowerCase();
        filtered = filtered.filter((row) =>
          Object.values(row).some(
            (val) =>
              String(val)
                .toLowerCase()
                .includes(query) &&
              Object.keys(row).some(
                (key) =>
                  columnSearchQuery[key]?.trim()?.toLowerCase() &&
                  row[key]
                    .toLowerCase()
                    .includes(columnSearchQuery[key].trim().toLowerCase())
              )
          )
        );
      }

      setFilteredRows(filtered);
    };

    filterRows();
  }, [searchQuery, columnSearchQuery]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleColumnSearchChange = (event, columnName) => {
    const { value } = event.target;
    setColumnSearchQuery((prevColumnSearchQuery) => ({
      ...prevColumnSearchQuery,
      [columnName]: value,
    }));
  };

  const handleSelectAll = () => {
    if (selectedRows.length === filteredRows.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredRows.map((_, index) => index));
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
    const rowData = filteredRows[index];
    setFormData({
      "Ticket ID": rowData["Ticket ID"],
      Progress: rowData.Progress,
      "Site Address": rowData["Site Address"],
      City: rowData.City,
      "Contact Number": rowData["Contact Number"],
      "Tracking Details": rowData["Tracking Details"],
      "Execution Date": rowData["Execution Date"],
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
    const rowData = filteredRows[index];
    const headers = Object.keys(rowData);
    const data = [headers.map((header) => rowData[header])];
    doc.autoTable({
      head: [headers],
      body: data,
    });
    doc.save(`${rowData["Ticket ID"] || "record"}_details.pdf`);
  };

  const toggleColumnVisibility = (columnName) => {
    setVisibleColumns((prevVisibleColumns) => ({
      ...prevVisibleColumns,
      [columnName]: !prevVisibleColumns[columnName],
    }));
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredRows.slice(indexOfFirstRow, indexOfLastRow);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setModalMode("add");
    setFormData({
      "Ticket ID": "",
      Progress: "",
      "Site Address": "",
      City: "",
      "Contact Number": "",
      "Tracking Details": "",
      "Execution Date": "",
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
      tabledata.push(formData); // Modify as per your data structure
    } else if (modalMode === "edit") {
      const index = tabledata.indexOf(filteredRows[actionIndex]);
      tabledata[index] = formData; // Modify as per your data structure
    }
    toggleModal();
  };

  const toggleSearchInput = (columnName) => {
    setVisibleSearchInputs((prevVisibleSearchInputs) => ({
      ...prevVisibleSearchInputs,
      [columnName]: !prevVisibleSearchInputs[columnName],
    }));
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Tickets" breadcrumbItem="All Tickets" />

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
                  <Row>
                    <Col lg="12">
                      <h4 className="card-title">All Tickets</h4>
                      <Row className="align-items-center">
                        <Col md={12} className="text-right">
                          <div className="d-flex justify-content-end mb-1 mt-2 mr-10">
                            <Button
                              color="success"
                              className="me-2"
                              onClick={() => {
                                setModalMode("add");
                                toggleModal();
                              }}
                            >
                              +
                            </Button>

                            <ButtonDropdown
                              isOpen={actionIndex === -1}
                              toggle={() => handleActionToggle(-1)}
                            >
                              <DropdownToggle caret color="primary">
                                Manage Columns
                              </DropdownToggle>
                              <DropdownMenu>
                                <DropdownItem header>Select columns to display:</DropdownItem>
                                <DropdownItem divider />
                                {Object.keys(visibleColumns).map((columnName) => (
                                  <DropdownItem key={columnName}>
                                    <input
                                      type="checkbox"
                                      checked={visibleColumns[columnName]}
                                      onChange={() => toggleColumnVisibility(columnName)}
                                    />{" "}
                                    {columnName}
                                  </DropdownItem>
                                ))}
                              </DropdownMenu>
                            </ButtonDropdown>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <Table className="table table-bordered table-hover">
                    <Thead>
                      <Tr>
                        <Th>
                          <Input
                            type="checkbox"
                            onChange={handleSelectAll}
                            checked={selectedRows.length === filteredRows.length}
                          />
                        </Th>
                        {Object.keys(visibleColumns).map(
                          (columnName) =>
                            visibleColumns[columnName] && (
                              <Th key={columnName}>
                                <span onClick={() => toggleSearchInput(columnName)}>
                                  {columnName.charAt(0).toUpperCase() + columnName.slice(1)}
                                </span>
                                {visibleSearchInputs[columnName] && (
                                  <Input
                                    type="text"
                                    placeholder={`Search ${columnName}`}
                                    value={columnSearchQuery[columnName]}
                                    onChange={(e) => handleColumnSearchChange(e, columnName)}
                                  />
                                )}
                              </Th>
                            )
                        )}
                        <Th>Action</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {currentRows.map((row, index) => (
                        <Tr key={index}>
                          <Td>
                            <Input
                              type="checkbox"
                              onChange={() => handleSelectRow(index)}
                              checked={isSelected(index)}
                            />
                          </Td>
                          {Object.keys(visibleColumns).map(
                            (columnName) =>
                              visibleColumns[columnName] && <Td key={columnName}>{row[columnName]}</Td>
                          )}
                          <Td>
                            <ButtonDropdown
                              isOpen={actionIndex === index}
                              toggle={() => handleActionToggle(index)}
                            >
                              <DropdownToggle caret>Action</DropdownToggle>
                              <DropdownMenu>
                                <DropdownItem onClick={() => handleEdit(index)}>Edit</DropdownItem>
                                <DropdownItem onClick={() => handleDelete(index)}>Delete</DropdownItem>
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
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {/* Modal for Add/Edit */}
      <Modal isOpen={isModalOpen} toggle={toggleModal}>
        <Form onSubmit={handleSubmit}>
          <ModalHeader toggle={toggleModal}>{modalMode === "add" ? "Add Ticket" : "Edit Ticket"}</ModalHeader>
          <ModalBody>
            {Object.keys(formData).map((fieldName) => (
              <FormGroup key={fieldName}>
                <Label>{fieldName}</Label>
                <Input
                  type="text"
                  name={fieldName}
                  value={formData[fieldName]}
                  onChange={handleInputChange}
                />
              </FormGroup>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggleModal}>
              Cancel
            </Button>
            <Button color="primary" type="submit">
              {modalMode === "add" ? "Add" : "Save Changes"}
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    </React.Fragment>
  );
};

export default ResponsiveTables;
  