import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
    Table, Row, Col, Card, CardBody, CardHeader, Input, Button,
    Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Pagination,
    PaginationItem, PaginationLink, Modal, ModalHeader, ModalBody, ModalFooter
} from "reactstrap";
import { CSVLink } from "react-csv";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Breadcrumbs from "../../components/Common/Breadcrumb";
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import "../../assets/scss/pages/table.scss";

// Create a type for react-dnd
const ItemType = {
    COLUMN: 'COLUMN',
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
            const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
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
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(drop(ref));

    return (
        <th
            ref={ref}
            style={{ opacity: isDragging ? 0.5 : 1, cursor: 'move' }}
        >
            {children}
        </th>
    );
};

const Team = () => {
    const [data, setData] = useState([
        { id: "Sanjay P", firstName: "sanjay@gmail.com", assign: "+919890453245", username: "Router Installation", status: "In-Progress", },
        // ... other data entries
    ]);

    const [columns, setColumns] = useState([
        { key: 'id', label: 'Name' },
        { key: 'firstName', label: 'Mail ID' },
        { key: 'assign', label: 'Mobile Number' },
        { key: 'username', label: 'Work' },
        { key: 'status', label: 'Status' },
        { key: 'actions', label: 'Actions' },
    ]);

    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
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
    });

    const toggleExportDropdown = () => setExportDropdownOpen(!exportDropdownOpen);
    const toggleManageColumnsDropdown = () => setManageColumnsDropdownOpen(!manageColumnsDropdownOpen);
    const toggleShowEntriesDropdownOpen = () => setShowEntriesDropdownOpen(!showEntriesDropdownOpen);
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
                data.filter(row => selectedRows.includes(row.id)).map(row => [row.id, row.firstName, row.assign, row.username, row.status]) :
                data.map(row => [row.id, row.firstName, row.assign, row.username, row.status])
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
            row.status.toLowerCase().includes(search.toLowerCase())
        );
    }).filter(row => {
        return Object.keys(searchColumn).every(key =>
            row[key].toString().toLowerCase().includes(searchColumn[key].toLowerCase())
        );
    });

    const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, (currentPage * itemsPerPage));
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

    const sortData = (key) => {
        let sortedData = [...data];
        let direction = 'ascending';

        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
            sortedData.reverse();
        } else {
            sortedData.sort((a, b) => (a[key] > b[key] ? 1 : -1));
        }

        setSortConfig({ key, direction });
        setData(sortedData);
    };

    const getIcon = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? '▲' : '▼';
        }
        return '▲';
    };

    const moveColumn = useCallback((dragIndex, hoverIndex) => {
        const newColumns = [...columns];
        const [draggedColumn] = newColumns.splice(dragIndex, 1);
        newColumns.splice(hoverIndex, 0, draggedColumn);
        setColumns(newColumns);
    }, [columns]);

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="page-content">
                <div className="container-fluid">
                    <Breadcrumbs title="Pages" breadcrumbItem="Team" />

                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardHeader>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <h4 className="card-title">Team List</h4>
                                        <div className="button-items">
                                            <Button color="primary">
                                                <Link to="/form" className="text-white">Add Team</Link>
                                            </Button>
                                            <Button color="secondary" className="ms-2" onClick={handleExportPDF}>Export PDF</Button>
                                            <Dropdown isOpen={exportDropdownOpen} toggle={toggleExportDropdown} className="d-inline-block ms-2">
                                                <DropdownToggle caret color="secondary">
                                                    Export
                                                </DropdownToggle>
                                                <DropdownMenu>
                                                    <DropdownItem>
                                                        <CSVLink data={data} filename={"table.csv"} className="text-dark">
                                                            Export CSV
                                                        </CSVLink>
                                                    </DropdownItem>
                                                    <DropdownItem>
                                                        <span onClick={handleExportPDF} className="text-dark">Export PDF</span>
                                                    </DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardBody>
                                    <div className="d-flex align-items-center mb-4">
                                        <div className="me-3">
                                            <Button color="primary" onClick={handleSelectAllRows}>
                                                {selectedRows.length === data.length ? 'Deselect All' : 'Select All'}
                                            </Button>
                                        </div>
                                        <div className="flex-grow-1">
                                            <Input type="text" placeholder="Search..." value={search} onChange={handleSearch} />
                                        </div>
                                        <div className="ms-3">
                                            <Button color="secondary" onClick={toggleManageColumnsDropdown}>Manage Columns</Button>
                                        </div>
                                        <Dropdown isOpen={showEntriesDropdownOpen} toggle={toggleShowEntriesDropdownOpen} className="ms-3">
                                            <DropdownToggle caret color="secondary">
                                                Show Entries
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem onClick={() => setItemsPerPage(5)}>5</DropdownItem>
                                                <DropdownItem onClick={() => setItemsPerPage(10)}>10</DropdownItem>
                                                <DropdownItem onClick={() => setItemsPerPage(20)}>20</DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                    </div>

                                    <Table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>
                                                    <Input type="checkbox" onClick={handleSelectAllRows} checked={selectedRows.length === data.length} />
                                                </th>
                                                {columns.map((column, index) => (
                                                    columnsVisibility[column.key] && (
                                                        <DraggableColumn key={column.key} column={column} index={index} moveColumn={moveColumn}>
                                                            <div className="d-flex align-items-center">
                                                                <span onClick={() => sortData(column.key)}>{column.label} {getIcon(column.key)}</span>
                                                                <Button color="link" size="sm" className="ms-2 p-0" onClick={() => toggleSearch(column.key)}>🔍</Button>
                                                            </div>
                                                        </DraggableColumn>
                                                    )
                                                ))}
                                                {columnsVisibility.actions && <th>Actions</th>}
                                            </tr>
                                            <tr>
                                                <th></th>
                                                {columns.map(column => (
                                                    columnsVisibility[column.key] && (
                                                        <th key={column.key}>
                                                            {searchVisible[column.key] && (
                                                                <Input type="text" placeholder={`Search ${column.label}`} value={searchColumn[column.key] || ""} onChange={(e) => handleColumnSearch(e, column.key)} />
                                                            )}
                                                        </th>
                                                    )
                                                ))}
                                                {columnsVisibility.actions && <th></th>}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedData.map((row) => (
                                                <tr key={row.id} className={selectedRows.includes(row.id) ? 'table-active' : ''}>
                                                    <td>
                                                        <Input type="checkbox" checked={selectedRows.includes(row.id)} onChange={() => handleSelectRow(row.id)} />
                                                    </td>
                                                    {columns.map(column => (
                                                        columnsVisibility[column.key] && (
                                                            <td key={column.key}>{row[column.key]}</td>
                                                        )
                                                    ))}
                                                    {columnsVisibility.actions && (
                                                        <td>
                                                            <Link to={`/form?edit=${row.id}`} className="btn btn-sm btn-primary me-2">Edit</Link>
                                                            <Button size="sm" color="danger" onClick={() => confirmDelete(row.id)}>Delete</Button>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                    <Pagination>
                                        <PaginationItem disabled={currentPage === 1}>
                                            <PaginationLink first onClick={() => handlePageChange(1)} />
                                        </PaginationItem>
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
                                        <PaginationItem disabled={currentPage === totalPages}>
                                            <PaginationLink last onClick={() => handlePageChange(totalPages)} />
                                        </PaginationItem>
                                    </Pagination>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            </div>

            <Modal isOpen={deleteModal} toggle={toggleDeleteModal}>
                <ModalHeader toggle={toggleDeleteModal}>Confirm Delete</ModalHeader>
                <ModalBody>
                    Are you sure you want to delete this row?
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={() => handleDelete(rowToDelete)}>Delete</Button>{' '}
                    <Button color="secondary" onClick={toggleDeleteModal}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </DndProvider>
    );
};

export default Team;
