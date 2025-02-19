import React from 'react'
import { Card, CardBody, Col, Container, Row, Table } from "reactstrap"

import nexappLogo from '../../assets/images/Nexapp_Logo.png'
import Breadcrumbs from "../../components/Common/Breadcrumb"
import { Link } from "react-router-dom"
import '../../assets/scss/general.css'
import instaone from '../../assets/images/Instaone.png'

const InvoicePage = () => {


    const printInvoice = () => {
        window.print()
    }

    const invoiceDetail = {
        shippingAddress: "Kenny Rigdon, 1234 Main , Apt. 4B ,Springfield ST 54321",
        billingAddress: "Kenny Rigdon, 1234 Main , Apt. 4B ,Springfield ST 54321",
        orderId: "1234Nexapp",
        orderDate: "October 16, 2019",
        orderSummary: [
            {
                id: '1',
                item: 'installatoin',
                description: 'Instaroute solution for branch, India1 - Jagtial - TS2700',
                circuitId: '23456',
                Price: 1300,
                IGST: '18 %',
                Total: 1500
            },
            {
                id: '2',
                item: 'installatoin',
                description: 'Instaroute solution for branch, India1 - Jagtial - TS2700',
                circuitId: '23456',
                Price: 1300,
                IGST: '18 %',
                Total: 1500
            },
            {
                id: '3',
                item: 'installatoin',
                description: 'Instaroute solution for branch, India1 - Jagtial - TS2700',
                circuitId: '23456',
                Price: 1300,
                IGST: '18 %',
                Total: 1500
            },
        ]
    }


    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    {/* Render Breadcrumbs */}
                    <Breadcrumbs title="Invoices" breadcrumbItem="Invoice Detail" />

                    <Row>
                        <Col lg="12">
                            <Card>
                                <CardBody>
                                    <div className="invoice-title">
                                        <div className="d-flex align-items-end">
                                            <div className="flex-grow-1">
                                                <div className="mb-1 ">
                                                    <img src={nexappLogo} alt="" height="80" /><span className="logo-txt"></span>
                                                </div>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <div className="mb-4">
                                                    <div className="float-end nexapp-address" style={{ textAlign: 'right' }}>
                                                        <h5>Nexapp Technologies Private Limited    </h5>
                                                        <p>403, 4th floor,Suyog Center, Gultekdi</p>
                                                        <p>Gultekadi, Pune, Maharashtra -411037</p>
                                                        <p>India</p>
                                                        <p>Phone -02067629999</p>
                                                        <p>CIN-U72900PN2014PTC153272       </p>
                                                        <p>GSTIN-27AAECN7911J1Z8</p>
                                                        <p>MSME Number-UDYAM-MH-26-0110667</p>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    <hr className="my-4" />
                                    <Row>
                                        <Col sm="6">
                                            <div>
                                                <h5 className="font-size-13 mb-2">Billed To:</h5>

                                                <div className=" nexapp-address" style={{ textAlign: 'left' }}>
                                                    <h5>India1 Payments Limited - Telangana  </h5>
                                                    <p>H.No. 3-6-520, Flat No.308,,Ashoka Scintlla</p>
                                                    <p>Himayatnagar</p>
                                                    <p>500075 Telangana India</p>
                                                    <p>GSTIN-36AADCB0396E1ZW</p>
                                                </div>
                                                <br />
                                            </div>


                                            <div>
                                                <h5 className="font-size-13 mb-2">Shipped To:</h5>
                                                <div className=" nexapp-address" style={{ textAlign: 'left' }}>
                                                    <h5>India1 Payments Limited - Telangana  </h5>
                                                    <p>H.No. 3-6-520, Flat No.308,,Ashoka Scintlla</p>
                                                    <p>Himayatnagar</p>
                                                    <p>500075 Telangana India</p>
                                                    <p>GSTIN-36AADCB0396E1ZW</p>

                                                </div>
                                                <br />
                                            </div>
                                        </Col>
                                        <Col sm="6">
                                            <div className='invoice-details'>
                                                <div>
                                                    <span >Invoice No : </span>
                                                    <span style={{ fontWeight: 400 }}>FY24-25/INV-1776</span>
                                                </div>

                                                <div>
                                                    <span >Invoice Date : </span>
                                                    <span style={{ fontWeight: 400 }}>21/08/2024</span>
                                                </div>

                                                <div>
                                                    <span >Payment Terms : </span>
                                                    <span style={{ fontWeight: 400 }}>30 Days</span>
                                                </div>
                                                <div>
                                                    <span >Due Date  : </span>
                                                    <span style={{ fontWeight: 400 }}>20/09/2024</span>
                                                </div>
                                                <div>
                                                    <span >PO Number : </span>
                                                    <span style={{ fontWeight: 400 }}>222302104</span>
                                                </div>
                                                <div>
                                                    <span >Invoice Start : </span>
                                                    <span style={{ fontWeight: 400 }}>01/04/2024</span>
                                                </div>
                                                <div>
                                                    <span >Invoice End date : </span>
                                                    <span style={{ fontWeight: 400 }}>21/06/2024</span>
                                                </div>
                                            </div>

                                        </Col>

                                    </Row>
                                    <div className="py-2 mt-3">
                                        <h3 className="font-size-15 fw-bold">Order summary</h3>
                                    </div>
                                    <div className="p-4 border rounded">
                                        <div className="table-responsive">
                                            <Table className="table-nowrap align-middle mb-0">
                                                <thead>
                                                    <tr>
                                                        <th style={{ width: "70px" }}>No.</th>
                                                        <th>Item</th>

                                                        <th >Price</th>

                                                        <th className="text-end" style={{ width: "120px" }}>Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>1</td>
                                                        <td>Router Installation</td>
                                                        <td>556</td>
                                                        <td className="text-end" >556</td>
                                                    </tr>
                                                    <tr>
                                                        <td>1</td>
                                                        <td>Router Installation</td>
                                                        <td>556</td>
                                                        <td className="text-end" >556</td>
                                                    </tr>
                                                    <br />
                                                    <tr >
                                                        <td colSpan="3" className="border-0  text-end">
                                                            Sub Total
                                                        </td>
                                                        <td className="text-end">556</td>
                                                    </tr>
                                                    <tr >
                                                        <td colSpan="3" className=" border-0  text-end">
                                                            GST (18%)
                                                        </td>
                                                        <td className="text-end"> + {(556 * 0.18).toFixed(2)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan="3" className=" border-0 text-end">
                                                            Platform Fee
                                                        </td>
                                                        <td className=" text-end"> + 100</td>
                                                    </tr>
                                                    <tr>
                                                        <td colSpan="3" className="border-0 text-end">
                                                            <strong>Total</strong>
                                                        </td>
                                                        <td className="border-0 text-end">
                                                            <h4 className="m-0">
                                                                {(556 + 556 * 0.18 + 100).toFixed(2)}
                                                            </h4>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </div>
                                    </div>
                                    <div className="d-print-none mt-4">
                                        <div className="float-end">
                                            <Link
                                                to="#"
                                                onClick={printInvoice}
                                                className="btn btn-success me-2"
                                            >
                                                <i className="fa fa-print" />
                                            </Link>
                                            {/* <Link to="#" className="btn btn-primary w-md ">
                                                Send
                                            </Link> */}
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                </Container>
            </div>
        </React.Fragment>
    )
}

export default InvoicePage