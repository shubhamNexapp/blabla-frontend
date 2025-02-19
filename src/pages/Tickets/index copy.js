import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Table, Row, Col, Card, CardBody, CardHeader, Input, Button,
    Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Pagination,
    PaginationItem, PaginationLink, Modal, ModalHeader, ModalBody, ModalFooter
} from "reactstrap";
import { CSVLink } from "react-csv";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Breadcrumbs from "../../components/Common/Breadcrumb";
import "../../assets/scss/pages/table.scss";

const Index = () => {
    const navigate = useNavigate();

    const [data, setData] = useState([
        { id: 211, firstName: "Router Installation", assign: "Sanjay G", username: "+919890453245", status: "In-Progress", date: "21 Jun 2023" },
        { id: 432, firstName: "PC Installation", assign: "Akshay P", username: "+917890453245", status: "In-Progress", date: "21 Jun 2023" },
        { id: 633, firstName: "CCTV Installation", assign: "Ajay S", username: "+919890453245", status: "Cancel", date: "21 Jun 2023" },
        { id: 214, firstName: "Router Installation", assign: "Vishal M", username: "+919890453245", status: "Done", date: "21 Jun 2023" },
    ]);

    const [search, setSearch] = useState("");
    const [searchColumn, setSearchColumn] = useState({});
    const [selectedRows, setSelectedRows] = useState([]);
    const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
    const [manageColumnsDropdownOpen, setManageColumnsDropdownOpen] = useState(false);
    const [showEntriesDropdownOpen, setShowEntriesDropdownOpen] = useState(false);
    const [columnsVisibility, setColumnsVisibility] = useState({
        id: true,
        firstName: true,
        assign: true,
        username: true,
        status: true,
        date: true,
        actions: true
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [deleteModal, setDeleteModal] = useState(false);
    const [rowToDelete, setRowToDelete] = useState(null);
    const [searchVisible, setSearchVisible] = useState({
        id: false,
        firstName: false,
        assign: false,
        username: false,
        status: false,
        date: false,
    });

    const toggleExportDropdown = () => setExportDropdownOpen(!exportDropdownOpen);
    const toggleManageColumnsDropdown = () => setManageColumnsDropdownOpen(!manageColumnsDropdownOpen);
    const toggleShowEntriesDropdown = () => setShowEntriesDropdownOpen(!showEntriesDropdownOpen);
    const toggleDeleteModal = () => setDeleteModal(!deleteModal);

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const handleColumnSearch = (e, column) => {
        setSearchColumn({ ...searchColumn, [column]: e.target.value });
    };

    const handleSelectRow = (id) => {
        setSelectedRows(prev => prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]);
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'In-Progress':
                return 'badge bg-warning ';
            case 'Cancel':
                return 'badge bg-danger ';
            case 'Done':
                return 'badge bg-success ';
            default:
                return 'badge bg-secondary';
        }
    };

    const handleSelectAllRows = () => {
        if (selectedRows.length === data.length) {
            setSelectedRows([]);
        } else {
            setSelectedRows(data.map(row => row.id));
        }
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        autoTable(doc, {
            head: [['#', 'First Name', 'Last Name', 'Username']],
            body: selectedRows.length ?
                data.filter(row => selectedRows.includes(row.id)).map(row => [row.id, row.firstName, row.assign, row.username, row.status, row.date]) :
                data.map(row => [row.id, row.firstName, row.assign, row.username, row.status, row.date])
        });
        doc.save('table.pdf');
    };

    const handleDelete = (id) => {
        setData(data.filter(row => row.id !== id));
        toggleDeleteModal();
    };

    const confirmDelete = (id) => {
        setRowToDelete(id);
        toggleDeleteModal();
    };

    const filteredData = data.filter(row => {
        return (
            row.firstName.toLowerCase().includes(search.toLowerCase()) ||
            row.assign.toLowerCase().includes(search.toLowerCase()) ||
            row.username.toLowerCase().includes(search.toLowerCase()) ||
            row.status.toLowerCase().includes(search.toLowerCase()) ||
            row.date.toLowerCase().includes(search.toLowerCase())
        );
    }).filter(row => {
        return Object.keys(searchColumn).every(key =>
            row[key].toString().toLowerCase().includes(searchColumn[key].toLowerCase())
        );
    });

    const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSelectAllColumns = () => {
        const allVisible = Object.values(columnsVisibility).every(v => v);
        const newVisibility = {};
        for (let key in columnsVisibility) {
            newVisibility[key] = !allVisible;
        }
        setColumnsVisibility(newVisibility);
    };

    const toggleSearch = (column) => {
        setSearchVisible(prev => ({
            ...prev,
            [column]: !prev[column]
        }));
    };

    const handleEdit = (rowId) => {
        // Find the row based on rowId
        const rowToEdit = data.find(row => row.id === rowId);
        // Redirect to edit page with row data
        navigate(`/edit-ticket/${rowId}`, { state: { rowData: rowToEdit } });
    };

    return (
        <div className="page-content">
            <div className="container-fluid">
                <Breadcrumbs title="Tickets" breadcrumbItem="All Tickets" />
                <Row>
                    <Col xl={12}>
                        <Card>
                            <CardHeader className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h4 className="card-title">All Tickets</h4>
                                </div>
                                <div>
                                    <Input type="text" placeholder="Search..." value={search} onChange={handleSearch} className="mr-2" />
                                </div>
                            </CardHeader>
                            <CardBody>
                                <div className="table-responsive">
                                    <Table className="table mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th>
                                                    <Dropdown isOpen={manageColumnsDropdownOpen} toggle={toggleManageColumnsDropdown} className="d-inline-block manage-col me-2">
                                                        <DropdownToggle caret>
                                                            <i className="dripicons-preview"></i>
                                                        </DropdownToggle>
                                                        <DropdownMenu left>
                                                            <DropdownItem toggle={false}>
                                                                <Input type="checkbox" checked={Object.values(columnsVisibility).every(v => v)} onChange={handleSelectAllColumns} /> Select All
                                                            </DropdownItem>
                                                            {Object.keys(columnsVisibility).map(col => (
                                                                <DropdownItem key={col} toggle={false}>
                                                                    <Input type="checkbox" checked={columnsVisibility[col]} onChange={() => setColumnsVisibility({ ...columnsVisibility, [col]: !columnsVisibility[col] })} /> {col}
                                                                </DropdownItem>
                                                            ))}
                                                        </DropdownMenu>
                                                    </Dropdown>
                                                </th>
                                                <th>
                                                    <Input type="checkbox" onChange={handleSelectAllRows} checked={selectedRows.length === data.length} />
                                                </th>
                                                {columnsVisibility.id && (
                                                    <th onClick={() => toggleSearch('id')}>
                                                        Ticket ID
                                                        {searchVisible.id && (
                                                            <Input type="text" placeholder="Search" onClick={(e) => e.stopPropagation()} onChange={(e) => handleColumnSearch(e, 'id')} />
                                                        )}
                                                    </th>
                                                )}
                                                {columnsVisibility.firstName && (
                                                    <th onClick={() => toggleSearch('firstName')}>
                                                        Subject
                                                        {searchVisible.firstName && (
                                                            <Input type="text" placeholder="Search" onClick={(e) => e.stopPropagation()} onChange={(e) => handleColumnSearch(e, 'firstName')} />
                                                        )}
                                                    </th>
                                                )}
                                                {columnsVisibility.assign && (
                                                    <th onClick={() => toggleSearch('assign')}>
                                                        Assign
                                                        {searchVisible.assign && (
                                                            <Input type="text" placeholder="Search" onClick={(e) => e.stopPropagation()} onChange={(e) => handleColumnSearch(e, 'assign')} />
                                                        )}
                                                    </th>
                                                )}
                                                {columnsVisibility.username && (
                                                    <th onClick={() => toggleSearch('username')}>
                                                        Contact No
                                                        {searchVisible.username && (
                                                            <Input type="text" placeholder="Search" onClick={(e) => e.stopPropagation()} onChange={(e) => handleColumnSearch(e, 'username')} />
                                                        )}
                                                    </th>
                                                )}
                                                {columnsVisibility.status && (
                                                    <th onClick={() => toggleSearch('status')}>
                                                        Status
                                                        {searchVisible.status && (
                                                            <Input type="text" placeholder="Search" onClick={(e) => e.stopPropagation()} onChange={(e) => handleColumnSearch(e, 'status')} />
                                                        )}
                                                    </th>
                                                )}
                                                {columnsVisibility.date && (
                                                    <th onClick={() => toggleSearch('date')}>
                                                        Last Update
                                                        {searchVisible.date && (
                                                            <Input type="text" placeholder="Search" onClick={(e) => e.stopPropagation()} onChange={(e) => handleColumnSearch(e, 'date')} />
                                                        )}
                                                    </th>
                                                )}
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedData.map(row => (
                                                <tr key={row.id}>
                                                    <td></td>
                                                    <td><Input type="checkbox" checked={selectedRows.includes(row.id)} onChange={() => handleSelectRow(row.id)} /></td>
                                                    {columnsVisibility.id && <td>{row.id}</td>}
                                                    {columnsVisibility.firstName && <td>{row.firstName}</td>}
                                                    {columnsVisibility.assign && <td>{row.assign}</td>}
                                                    {columnsVisibility.username && <td>{row.username}</td>}
                                                    {columnsVisibility.status && <td><span className={getStatusBadgeClass(row.status)}>{row.status}</span></td>}
                                                    {columnsVisibility.date && <td>{row.date}</td>}
                                                    <td>
                                                        <DropdownComponent rowId={row.id} onEdit={handleEdit} confirmDelete={confirmDelete} />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                                <Pagination aria-label="Page navigation example" className="mt-3">
                                    <PaginationItem disabled={currentPage === 1}>
                                        <PaginationLink previous onClick={() => handlePageChange(currentPage - 1)} />
                                    </PaginationItem>
                                    {[...Array(totalPages)].map((_, index) => (
                                        <PaginationItem active={index + 1 === currentPage} key={index}>
                                            <PaginationLink onClick={() => handlePageChange(index + 1)}>
                                                {index + 1}
                                            </PaginationLink>
                                        </PaginationItem>
                                    ))}
                                    <PaginationItem disabled={currentPage === totalPages}>
                                        <PaginationLink next onClick={() => handlePageChange(currentPage + 1)} />
                                    </PaginationItem>
                                    <Dropdown isOpen={showEntriesDropdownOpen} toggle={toggleShowEntriesDropdown} className="d-inline-block me-2">
                                        <DropdownToggle caret>
                                            Show Entries
                                        </DropdownToggle>
                                        <DropdownMenu right>
                                            {[10, 20, 30, 40].map(number => (
                                                <DropdownItem key={number} onClick={() => setItemsPerPage(number)}>{number} entries</DropdownItem>
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
                    Are you sure you want to delete this record?
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={() => handleDelete(rowToDelete)}>Delete</Button>{' '}
                    <Button color="secondary" onClick={toggleDeleteModal}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
};

const DropdownComponent = ({ rowId, onEdit, confirmDelete }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    return (
        <Dropdown className='action' isOpen={dropdownOpen} toggle={toggleDropdown}>
            <DropdownToggle caret>
                <i className="dripicons-dots-3"></i>
            </DropdownToggle>
            <DropdownMenu>
                <DropdownItem onClick={() => onEdit(rowId)}>Edit</DropdownItem>
                <DropdownItem onClick={() => confirmDelete(rowId)}>Delete</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
};

export default Index;
