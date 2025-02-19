import React from "react"

import { Row, Col, Card, CardBody, CardHeader} from "reactstrap"
// Editable
import BootstrapTable from "react-bootstrap-table-next"
import cellEditFactory from "react-bootstrap-table2-editor"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

const products = [
  { id: 1, name: "David McHenry", age: 25, qty: 1500, cost: 1000 },
  { id: 2, name: "Frank Kirk", age: 34, qty: 1900, cost: 1300 },
  { id: 3, name: "Rafael Morales", age: 67, qty: 1300, cost: 1300 },
  { id: 4, name: "Mark Ellison", age: 23, qty: 1100, cost: 6400 },
  { id: 5, name: "Minnie Walter", age: 78, qty: 1400, cost: 4000 },
]

const columns = [
  {
    dataField: "id",
    text: "ID",
  },
  {
    dataField: "name",
    text: "Name",
  },
  {
    dataField: "age",
    text: "Age(AutoFill)",
  },
  {
    dataField: "qty",
    text: "Qty(AutoFill and Editable)",
  },
  {
    dataField: "cost",
    text: "Cost(Editable)",
  },
]

const EditableTables = () => {
  //meta title
  document.title = "Editable | Minia - React Admin & Dashboard Template";
  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Tables" breadcrumbItem="Editable" />

          <Row>
            <Col>
              <Card>
                <CardHeader>
                  <h4 className="card-title">Datatable Editable</h4>
                </CardHeader>
                <CardBody>
                  <div className="table-responsive">
                    <BootstrapTable
                      keyField="id"
                      data={products}
                      columns={columns}
                      cellEdit={cellEditFactory({ mode: "click" })}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </React.Fragment>
  )
}

export default EditableTables
