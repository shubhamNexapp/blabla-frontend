import React from "react"

import { Container, Row, Col, Card, CardBody, CardHeader } from "reactstrap"

//Import maps
// import SimpleMap from "./LeafletMap/SimpleMap"
// import MapWithPopup from "./LeafletMap/MapWithPopup"
// import MapVectorLayers from "./LeafletMap/MapVectorLayers"
// import MapMarkerCustomIcons from "./LeafletMap/MapMarkerCustomIcons"
// import LayerGroup from "./LeafletMap/LayerGroup"
// import MapLayerControl from "./LeafletMap/MapLayerControl"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"
import LeafletMap from "./LeafletMap/LeafletMap"

const Map = () => {
  //meta title
  document.title = "Instaone";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Maps" breadcrumbItem="Vendor Map" />
          <Row>

            <Col lg="12">
              <Card>
                <CardBody>
                  <h4 className="card-title">All Vendors</h4>
                  {/* <div id="leaflet-map-custom-icons" className="leaflet-map"> */}

                  {/* <MapMarkerCustomIcons /> */}
                  <LeafletMap />

                </CardBody>
              </Card>
            </Col>
          </Row>


        </Container>
      </div>
    </React.Fragment>
  )
}

export default Map
