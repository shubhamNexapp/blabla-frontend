import React, { useState } from "react";
import { SketchPicker } from "react-color";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Label,
  Button,
  Form,
  Input,
  CardHeader,
  FormFeedback,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import Breadcrumbs from "../../components/Common/Breadcrumb";

const AddGroup = () => {
  document.title = "Add Group";

  const [color, setColor] = useState("#fff");
  const [displayColorPicker, setDisplayColorPicker] = useState(false);
  const [groups, setGroups] = useState([
    { id: 1, groupname: "Cyber Security", color: "#FF5733" },
    { id: 2, groupname: "SD-WAN", color: "#33FF57" },
    { id: 3, groupname: "M2M", color: "#5733FF" },
  ]);
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [modal, setModal] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState([]);

  const toggleModal = () => setModal(!modal);

  const validationType = useFormik({
    enableReinitialize: true,
    initialValues: {
      groupname: "",
    },
    validationSchema: Yup.object().shape({
      groupname: Yup.string().required("This value is required"),
    }),
    onSubmit: (values) => {
      if (editIndex !== null) {
        const updatedGroups = [...groups];
        updatedGroups[editIndex] = { ...values, color };
        setGroups(updatedGroups);
        setEditIndex(null);
      } else {
        const newGroup = { id: groups.length + 1, ...values, color };
        setGroups([...groups, newGroup]);
      }
      validationType.resetForm();
      setColor("#fff");
      toggleModal();
    },
  });

  const handleDeleteGroups = () => {
    const updatedGroups = groups.filter(
      (group) => !selectedGroups.includes(group.id)
    );
    setGroups(updatedGroups);
    setSelectedGroups([]);
  };

  const handleEditGroup = (index) => {
    const groupToEdit = groups[index];
    validationType.setValues({
      groupname: groupToEdit.groupname,
    });
    setColor(groupToEdit.color);
    setEditIndex(index);
    toggleModal();
  };

  const handleColorChange = (selectedColor) => {
    setColor(selectedColor.hex);
  };

  const toggleSelectGroup = (groupId) => {
    if (selectedGroups.includes(groupId)) {
      setSelectedGroups(selectedGroups.filter((id) => id !== groupId));
    } else {
      setSelectedGroups([...selectedGroups, groupId]);
    }
  };

  const toggleDropdown = (index) => {
    const newDropdownOpen = [...dropdownOpen];
    newDropdownOpen[index] = !newDropdownOpen[index];
    setDropdownOpen(newDropdownOpen);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Groups" breadcrumbItem="Add Group" />

          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <h4 className="card-title mb-2">Group List</h4>
                  <div className="hstack gap-2 justify-content-end">
                    <Button
                      type="button"
                      color="primar"
                      className="btn btn-primary"
                      onClick={toggleModal}
                    >
                      Add Group
                    </Button>
                    <Button
                      type="button"
                      color="danger"
                      className="btn btn-danger"
                      onClick={handleDeleteGroups}
                      disabled={selectedGroups.length === 0}
                    >
                      Delete Selected
                    </Button>
                  </div>
                </CardHeader>
                <CardBody>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>
                          <Input
                            type="checkbox"
                            onChange={() =>
                              setSelectedGroups(
                                selectedGroups.length === groups.length
                                  ? []
                                  : groups.map((group) => group.id)
                              )
                            }
                            checked={selectedGroups.length === groups.length}
                          />
                        </th>
                        <th>#</th>
                        <th>Group Name</th>
                        <th>Action</th>

                      </tr>
                    </thead>
                    <tbody>
                      {groups.map((group, index) => (
                        <tr key={index}>
                          <td>
                            <Input
                              type="checkbox"
                              onChange={() => toggleSelectGroup(group.id)}
                              checked={selectedGroups.includes(group.id)}
                            />
                          </td>
                          <td>{group.id}</td>
                          <td>{group.groupname}</td>
                          <td>
                            <Dropdown
                              isOpen={dropdownOpen[index]}
                              toggle={() => toggleDropdown(index)}
                            >
                              <DropdownToggle color="primay" caret>
                                ...
                              </DropdownToggle>
                              <DropdownMenu>
                                <DropdownItem onClick={() => handleEditGroup(index)}>
                                  Edit
                                </DropdownItem>
                                <DropdownItem onClick={() => handleDeleteGroups(index)}>
                                  Delete
                                </DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                          </td>

                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Add/Edit Group Modal */}
      <Modal isOpen={modal} toggle={toggleModal}>
        <Form onSubmit={validationType.handleSubmit}>
          <ModalHeader toggle={toggleModal}>
            {editIndex !== null ? "Edit Group" : "Add Group"}
          </ModalHeader>
          <ModalBody>
            <Label className="form-label">Group Name</Label>
            <Input
              name="groupname"
              placeholder="Enter group name"
              type="text"
              onChange={validationType.handleChange}
              onBlur={validationType.handleBlur}
              value={validationType.values.groupname || ""}
              invalid={
                validationType.touched.groupname &&
                  validationType.errors.groupname
                  ? true
                  : false
              }
            />
            {validationType.touched.groupname &&
              validationType.errors.groupname && (
                <FormFeedback type="invalid">
                  {validationType.errors.groupname}
                </FormFeedback>
              )}

            <Label className="form-label mt-3">Select Color</Label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => setDisplayColorPicker(!displayColorPicker)}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  backgroundColor: color,
                  marginRight: "10px",
                  border: "1px solid #ccc",
                }}
              />
              <Input
                value={color}
                readOnly
                onClick={() => setDisplayColorPicker(!displayColorPicker)}
              />
            </div>
            {displayColorPicker && (
              <div style={{ position: "absolute", zIndex: 2 }}>
                <div
                  style={{
                    position: "fixed",
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                  }}
                  onClick={() => setDisplayColorPicker(false)}
                />
                <SketchPicker
                  color={color}
                  onChangeComplete={handleColorChange}
                />
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggleModal}>
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Save
            </Button>{" "}

          </ModalFooter>
        </Form>
      </Modal>
    </React.Fragment>
  );
};

export default AddGroup;
