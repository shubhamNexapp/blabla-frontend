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
  const [columnSearchQuery, setColumnSearchQuery] = useState({
    company: "",
    lastTrade: "",
    tradeTime: "",
    change: "",
    prevClose: "",
    open: "",
    bid: "",
    ask: "",
    targetEst: "",
  });
  const [visibleSearchInputs, setVisibleSearchInputs] = useState({
    company: false,
    lastTrade: false,
    tradeTime: false,
    change: false,
    prevClose: false,
    open: false,
    bid: false,
    ask: false,
    targetEst: false,
  });

  // Update filteredRows whenever searchQuery or tabledata changes
  useEffect(() => {
    const filterRows = () => {
      let filtered = tabledata;

      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        filtered = filtered.filter((row) =>
          Object.values(row).some((val) =>
            String(val).toLowerCase().includes(query)
          )
        );
      }

      Object.keys(columnSearchQuery).forEach((key) => {
        if (columnSearchQuery[key].trim()) {
          const query = columnSearchQuery[key].trim().toLowerCase();
          filtered = filtered.filter((row) =>
            row[key].toString().toLowerCase().includes(query)
          );
        }
      });

      setFilteredRows(filtered);
    };

    filterRows();
  }, [searchQuery, columnSearchQuery]);

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
    const rowData = filteredRows[index];
    const headers = Object.keys(rowData);
    const data = [headers.map((header) => rowData[header])];
    doc.autoTable({
      head: [headers],
      body: data,
    });
    doc.save(`${rowData.ticker || "record"}_details.pdf`);
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

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    setModalMode("add");
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

  const handleColumnSearchChange = (event, columnName) => {
    const { value } = event.target;
    setColumnSearchQuery((prevColumnSearchQuery) => ({
      ...prevColumnSearchQuery,
      [columnName]: value,
    }));
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
                  <h4 className="card-title">Responsive Table</h4>
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
                                    onChange={(event) => handleColumnSearchChange(event, columnName)}
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
                              checked={isSelected(index)}
                              onChange={() => handleSelectRow(index)}
                            />
                          </Td>
                          {Object.keys(visibleColumns).map(
                            (columnName) =>
                              visibleColumns[columnName] && (
                                <Td key={columnName}>{row[columnName]}</Td>
                              )
                          )}
                          <Td>
                            <ButtonDropdown
                              isOpen={actionIndex === index}
                              toggle={() => handleActionToggle(index)}
                            >
                              <DropdownToggle caret>Action</DropdownToggle>
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
                  <CustomPagination
                    rowsPerPage={rowsPerPage}
                    totalRows={searchQuery.trim() ? filteredRows.length : tabledata.length}
                    paginate={paginate}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      <Modal isOpen={isModalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>
          {modalMode === "add" ? "Add Data" : "Edit Data"}
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="ticker">Ticker</Label>
              <Input
                type="text"
                id="ticker"
                name="ticker"
                value={formData.ticker}
                onChange={handleInputChange}
                required
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
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="price">Price</Label>
              <Input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
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
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="change">Change</Label>
              <Input
                type="number"
                id="change"
                name="change"
                value={formData.change}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="low">Low</Label>
              <Input
                type="number"
                id="low"
                name="low"
                value={formData.low}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="high">High</Label>
              <Input
                type="number"
                id="high"
                name="high"
                value={formData.high}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="bidQuantity">Bid Quantity</Label>
              <Input
                type="number"
                id="bidQuantity"
                name="bidQuantity"
                value={formData.bidQuantity}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="askQuantity">Ask Quantity</Label>
              <Input
                type="number"
                id="askQuantity"
                name="askQuantity"
                value={formData.askQuantity}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="volume">Volume</Label>
              <Input
                type="number"
                id="volume"
                name="volume"
                value={formData.volume}
                onChange={handleInputChange}
                required
              />
            </FormGroup>
            <Button type="submit" color="primary">
              {modalMode === "add" ? "Add" : "Save"}
            </Button>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggleModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </React.Fragment>
  );
};

export default ResponsiveTables;
