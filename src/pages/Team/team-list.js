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
        { id: "Sujay G", firstName: "sujay@gmail.com", assign: "+919890453245", username: "Router Installation", status: "In-Progress", },
        { id: "Ankit M", firstName: "ankit@gmail.com", assign: "+917890453245", username: "Router Installation", status: "Cancel", },
        { id: "Rajesh K", firstName: "rajesh@gmail.com", assign: "+917890453245", username: "CCTV Installation", status: "Done", },
        { id: "Nitin B", firstName: "nitin@gmail.com", assign: "+919890453245", username: "CCTV Installation", status: "Done", },
        { id: "Naresh C", firstName: "naresh@gmail.com", assign: "+917890453245", username: "Router Installation", status: "Done", },
        { id: "Akshay P", firstName: "akshay@gmail.com", assign: "+917890453245", username: "Router Installation", status: "Done" },
        { id: "Suraj M", firstName: "suraj@gmail.com", assign: "+917890453245", username: "Router Installation", status: "Done" },
        { id: "Ajay P", firstName: "ajay@gmail.com", assign: "+917890453245", username: "CCTV Installation", status: "Done" },
        { id: "Anil T", firstName: "anil@gmail.com", assign: "+917890453245", username: "CCTV Installation", status: "Done" },
        { id: "Tushar G", firstName: "tushar@gmail.com", assign: "+917890453245", username: "Router Installation", status: "Done", },
        { id: "Nikhil K", firstName: "nikhil@gmail.com", assign: "+917890453245", username: "CCTV Installation", status: "Done" },
    ]);


    const [columns, setColumns] = useState([
        { key: 'id', label: 'Name' },
        { key: 'firstName', label: 'Mail ID' },
        { key: 'assign', label: 'Mobile Number' },
        { key: 'username', label: 'Work' },
        { key: 'status', label: 'Status' },
        // { key: 'actions', label: 'Actions' },
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
            row.status.toLowerCase().includes(search.toLowerCase())
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
                    <Breadcrumbs title="Team" breadcrumbItem="All Team Members" />
                    <Row>
                        <Col xl={12}>
                            <Card>
                                <CardHeader className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h4 className="card-title">All Team Members</h4>
                                    </div>
                                    <div>
                                        <Input type="text" placeholder="Search..." value={search} onChange={handleSearch} className="mr-2" />
                                    </div>
                                </CardHeader>
                                <Row>
                                    <Col xl={12}>
                                        <div className="table-settings">
                                            <Link to="/add-team" className="me-2 btn btn-light"><i className="dripicons-plus"></i></Link>
                                            <Dropdown isOpen={exportDropdownOpen} toggle={toggleExportDropdown} className="d-inline-block  btn-light me-2">
                                                <DropdownToggle caret>
                                                    <i className="dripicons-export"></i>
                                                </DropdownToggle>
                                                <DropdownMenu right className="me-2">
                                                    <DropdownItem onClick={handleExportPDF}>Export to PDF</DropdownItem>
                                                    <CSVLink data={selectedRows.length ? data.filter(row => selectedRows.includes(row.id)) : data} filename={"table.csv"}>
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
                                    <div className="table-responsive ">
                                        <Table className="table mb-0 table-hover">
                                            <thead className="table-light">
                                                <tr style={{ textAlign: 'center' }}>

                                                    <th style={{ width: '64px', paddingLeft: '5px' }}>
                                                        <span>
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
                                                        </span>
                                                        <Input type="checkbox" onChange={handleSelectAllRows} checked={selectedRows.length === data.length} />
                                                    </th>
                                                    {columns.map((column, index) => (
                                                        columnsVisibility[column.key] && (
                                                            <DraggableColumn key={column.key} column={column} index={index} moveColumn={moveColumn}>
                                                                <div className="d-flex align-items-center">
                                                                    <span className='sort-icon' onClick={() => sortData(column.key)}>{column.label} {getIcon(column.key)}</span>
                                                                </div>
                                                            </DraggableColumn>
                                                        )
                                                    ))}

                                                    {columnsVisibility.actions && <th>Actions</th>}

                                                </tr>

                                                <tr className='search-col'>
                                                    <th></th>
                                                    {columns.map(column => (
                                                        columnsVisibility[column.key] && (
                                                            <th key={column.key}>
                                                                {[column.key] && (
                                                                    <Input type="text" placeholder={`Search ${column.label}`} value={searchColumn[column.key] || ""} onChange={(e) => handleColumnSearch(e, column.key)} />
                                                                )}
                                                            </th>
                                                        )
                                                    ))}
                                                    {columnsVisibility.actions && <th></th>}
                                                </tr>



                                            </thead>
                                            <tbody>
                                                {/* <tr>

                                                <td></td>
                                                {columnsVisibility.id && <td><Input type="text" style={{ height: '30px', width: '125px' }} placeholder="Search" onClick={(e) => e.stopPropagation()} onChange={(e) => handleColumnSearch(e, 'id')} />
                                                </td>}
                                                {columnsVisibility.firstName && <td> <Input type="text" style={{ height: '30px', width: '125px' }} placeholder="Search" onClick={(e) => e.stopPropagation()} onChange={(e) => handleColumnSearch(e, 'firstName')} /></td>}
                                                {columnsVisibility.assign && <td> <Input type="text" style={{ height: '30px', width: '125px' }} placeholder="Search" onClick={(e) => e.stopPropagation()} onChange={(e) => handleColumnSearch(e, 'assign')} /></td>}
                                                {columnsVisibility.username && <td> <Input type="text" style={{ height: '30px', width: '125px' }} placeholder="Search" onClick={(e) => e.stopPropagation()} onChange={(e) => handleColumnSearch(e, 'username')} /></td>}
                                                {columnsVisibility.status && <td><Input type="text" style={{ height: '30px', width: '125px' }} placeholder="Search" onClick={(e) => e.stopPropagation()} onChange={(e) => handleColumnSearch(e, 'status')} /></td>}

                                            </tr> */}
                                                {paginatedData.map((row) => (
                                                    <tr style={{ textAlign: 'center' }} key={row.id}>
                                                        <td style={{ minWidth: '64px', paddingLeft: '5px' }}>
                                                            <Input type="checkbox" checked={selectedRows.includes(row.id)} onChange={() => handleSelectRow(row.id)} />
                                                        </td>
                                                        {columns.map(column => (
                                                            columnsVisibility[column.key] && (
                                                                <td key={column.key}>
                                                                    {column.key === 'id' ? (
                                                                        <Link   to={`/edit-ticket/${row.id}`}  state={{ row: row }} className="text-decoration-none">
                                                                            {row[column.key]}
                                                                        </Link>
                                                                    ) : column.key === 'status' ? (
                                                                        <span className={getStatusBadgeClass(row[column.key])}>
                                                                            {row[column.key]}
                                                                        </span>
                                                                    ) : (
                                                                        row[column.key]
                                                                    )}
                                                                </td>
                                                            )
                                                        ))}
                                                        {columnsVisibility.actions && (
                                                            <td>
                                                                <DropdownComponent row={row} confirmDelete={confirmDelete} />
                                                            </td>
                                                        )}
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
                                        <Dropdown isOpen={showEntriesDropdownOpen} toggle={toggleShowEntriesDropdown} style={{ marginLeft: "20px" }} className="d-inline-block me-2">
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
        </DndProvider>
    );
};

const DropdownComponent = ({ row, confirmDelete }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
    console.log(row);


    return (
        <Dropdown className='action' isOpen={dropdownOpen} toggle={toggleDropdown}>
            <DropdownToggle caret>
                <i className="dripicons-dots-3"></i>
            </DropdownToggle>
            <DropdownMenu>
                <DropdownItem >
                    <Link
                        to={`/edit-ticket/${row.id}`}
                        state={{ row: row }} // Pass entire row data as state
                        className="edit-btn me-2"
                    >
                        Edit
                    </Link>

                </DropdownItem>
                <DropdownItem onClick={() => confirmDelete(row.id)}>Delete</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
};

export default Team;
