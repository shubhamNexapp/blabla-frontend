import React from 'react'
import {
    Modal,
    ModalHeader,
    ModalBody,
    Form,
    Label,
    Input,
    FormFeedback,
    Row,Col
  } from "reactstrap";

function TicketModal({ modal, toggle, isEdit, validation }) {


    
  return (
    <div>
        <Modal isOpen={modal} toggle={toggle}>
                  <ModalHeader toggle={toggle} tag="h4">
                    {isEdit ? "Edit Ticket" : "Add Ticket"}
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
                          <Label className="form-label">Ticket ID</Label>
                          <div className="mb-3">
                            <Input
                              name="invoiceId"
                              type="text"
                              placeholder="INSTA0124"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              readonly='readonly'
                              value={validation.values.invoiceId || ""}
                              invalid={
                                validation.touched.invoiceId &&
                                  validation.errors.invoiceId
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.invoiceId &&
                              validation.errors.invoiceId ? (
                              <FormFeedback type="invalid">
                                {validation.errors.invoiceId}
                              </FormFeedback>
                            ) : null}
                          </div>
                          <div className="mb-3">
                            <Label className="form-label">Ticket Description</Label>
                            <Input
                              name="founder"
                              type="text"
                              placeholder="Insert Billing Name"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.founder || ""}
                              invalid={
                                validation.touched.founder &&
                                  validation.errors.founder
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.founder &&
                              validation.errors.founder ? (
                              <FormFeedback type="invalid">
                                {validation.errors.founder}
                              </FormFeedback>
                            ) : null}
                          </div>
                          <div className="mb-3">
                            <Label className="form-label">Amount</Label>
                            <Input
                              name="Amount"
                              type="text"
                              placeholder="Insert Amount"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                            
                            />
                            {validation.touched.Amount &&
                              validation.errors.Amount ? (
                              <FormFeedback type="invalid">
                                {validation.errors.Amount}
                              </FormFeedback>
                            ) : null}
                          </div>
                          <div className="mb-3">
                            <Label className="form-label">Status</Label>
                            <Input
                              name="status"
                              type="select"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              multiple={false}
                              className="form-select"
                              value={validation.values.status || ""}
                              invalid={
                                validation.touched.status &&
                                  validation.errors.status
                                  ? true
                                  : false
                              }
                            >
                              <option>Paid</option>
                              <option>Pending</option>
                            </Input>
                            {validation.touched.status &&
                              validation.errors.status ? (
                              <FormFeedback type="invalid">
                                {validation.errors.status}
                              </FormFeedback>
                            ) : null}
                          </div>

                          <div className="mb-3">
                            <Label className="form-label">Date</Label>
                            <Input
                              name="date"
                              type="date"
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.date || ""}
                              invalid={
                                validation.touched.date &&
                                  validation.errors.date
                                  ? true
                                  : false
                              }
                            ></Input>
                            {validation.touched.date &&
                              validation.errors.date ? (
                              <FormFeedback type="invalid">
                                {validation.errors.date}
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
    </div>
  )
}

export default TicketModal
