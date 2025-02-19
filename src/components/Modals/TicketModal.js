import React from "react";
import { Modal, CardBody } from "reactstrap";
import moment from "moment";

const TickeModal = ({ isOpen, toggle, ticketDetails }) => {

  return (
    <>
      <Modal isOpen={isOpen} toggle={toggle} centered={true}>
        <div className="modal-header">
          <h5 className="modal-title mt-0">Ticket Details</h5>
          <button
            type="button"
            onClick={toggle}
            className="close"
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <CardBody className="p-4">
          <div className="mb-3 p-2 d-flex justify-content-between">
            <strong className="text-muted">Ticket Name:</strong>
            <span className="text-dark">
              <b>{ticketDetails?.ticketName}</b>
            </span>
          </div>
          <div className="mb-3 d-flex justify-content-between">
            <strong className="text-muted">Ticket ID:</strong>
            <span className="text-dark">{ticketDetails?.ticketID}</span>
          </div>
          <div className="mb-3 d-flex justify-content-between">
            <strong className="text-muted">Ticket Time:</strong>
            <span className="text-dark">
              {moment(ticketDetails?.dateRange?.[0]).format("DD-MM-YYYY HH:mm")}
            </span>
            <span className="text-dark">
              {moment(ticketDetails?.dateRange?.[1]).format("DD-MM-YYYY HH:mm")}
            </span>
          </div>
          <div className="mb-3 d-flex justify-content-between">
            <strong className="text-muted">Status:</strong>
            <span className="text-dark">{ticketDetails?.status}</span>
          </div>
          <div className="mb-3 d-flex justify-content-between">
            <strong className="text-muted">Site Address:</strong>
            <span className="text-dark">{ticketDetails?.siteAddress}</span>
          </div>
          <div className="mb-3 d-flex justify-content-between">
            <strong className="text-muted">Contact Name:</strong>
            <span className="text-dark">{ticketDetails?.localContactName}</span>
          </div>
          <div className="mb-3 d-flex justify-content-between">
            <strong className="text-muted">Mobile Number:</strong>
            <span className="text-dark">{ticketDetails?.mobileNumber}</span>
          </div>
          <div className="mb-3 d-flex justify-content-between">
            <strong className="text-muted">Service:</strong>
            <span className="text-dark">{ticketDetails?.service}</span>
          </div>
          <div className="mb-3 d-flex justify-content-between">
            <strong className="text-muted">BOQ Details:</strong>
            <span className="text-dark">{ticketDetails?.boqDetails}</span>
          </div>
          <div className="mb-3 d-flex justify-content-between">
            <strong className="text-muted">IR Report:</strong>
            <span className="text-dark">
              <img
                style={{ height: "50px", width: "50px" }}
                src={ticketDetails?.irFile}
              />
            </span>
          </div>
        </CardBody>
      </Modal>
    </>
  );
};

export default TickeModal;
