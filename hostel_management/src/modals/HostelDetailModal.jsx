import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Typography } from "@mui/material";
import { useState, useEffect } from "react";

const HostelDetailModal = ({
  show,
  handleClose,
  handleSave,
  mode,
  formData,
  setFormData,
  tenantMaster,
  stateMaster,
  distMaster,
}) => {
  const title = mode === "edit" ? "Edit Hostel Details" : "Add Hostel Details";

  const [filterDist, setFilterDist] = useState([]);
  const [error, setError] = useState({
    hostelName: "",
    contactNumber: "",
    totalFloors: "",
    address: "",
    state_id: "",
    dist_id: "",
    city: "",
    pincode: "",
    tenantType: "",
  });

  const handleStateChange = (e) => {
    const stateID = e.target.value;

    setFormData((prev) => ({
      ...prev,
      state_id: stateID,
      dist_id: "",
    }));
  };

  useEffect(() => {
    if (formData.state_id) {
      const districts = distMaster.filter(
        (dist) => dist.state_id == formData.state_id
      );
      setFilterDist(districts);
    }
  }, [formData.state_id]);

  useEffect(() => {
    if (formData.state_id) {
      const districts = distMaster.filter(
        (dist) => dist.state_id == formData.state_id
      );
      setFilterDist(districts);
    }
  }, []);

  const handleDistrictChange = (e) => {
    const distID = e.target.value;

    setFormData((prev) => ({
      ...prev,
      dist_id: distID,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validForm()) {
      handleSave(formData);
    }
  };

  const validatePhoneNumber = (number) => {
    const phoneRegex =
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    return phoneRegex.test(number);
  };

  const pincodeRegex = /^[1-9]{1}[0-9]{5}$/;

  const validForm = () => {
    let isValid = true;
    let newError = {};

    if (!formData.hostelName) {
      newError.hostelName = "Please Enter Hostel name";
      isValid = false;
    }
    if (!formData.contactNumber) {
      newError.contactNumber = "Please Enter Contact";
      isValid = false;
    } else if (!validatePhoneNumber(formData.contactNumber)) {
      newError.contactNumber = "Please Enter valid Contact";
      isValid = false;
    }
    if (!formData.totalFloors) {
      newError.totalFloors = "Please Enter Total Floors";
      isValid = false;
    }
    if (!formData.tenantType || formData.tenantType === "") {
      newError.tenantType = "Please Select Tenant Type";
      isValid = false;
    }

    if (!formData.address) {
      newError.address = "Please Enter Address";
      isValid = false;
    }
    if (!formData.state_id) {
      newError.state_id = "Please Select State";
      isValid = false;
    }
    if (!formData.dist_id) {
      newError.dist_id = "Please Select District";
      isValid = false;
    }
    if (!formData.city) {
      newError.city = "Please Enter city";
      isValid = false;
    }
    if (!formData.pincode || !pincodeRegex.test(formData.pincode)) {
      newError.pincode = "Please Enter isValid pincode";
      isValid = false;
    }

    setError(newError);
    return isValid;
  };

  // for Edit
  useEffect(() => {
    if (formData.state_id) {
      const filtered = distMaster.filter(
        (dist) => dist.state_id === formData.state_id
      );
      setFilterDist(filtered);
    }
  }, []);

  return (
    <>
      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Hostel Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="hostelName"
                    value={formData.hostelName}
                    onChange={(e) =>
                      setFormData({ ...formData, hostelName: e.target.value })
                    }
                    placeholder="Hostel Name"
                  />
                  {error.hostelName && (
                    <div style={{ color: "red" }}>{error.hostelName}</div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Contact Number</Form.Label>
                  <Form.Control
                    type="text"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contactNumber: e.target.value,
                      })
                    }
                    placeholder="Contact Number"
                    autoComplete="off"
                  />
                  {error.contactNumber && (
                    <div style={{ color: "red" }}>{error.contactNumber}</div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Total Floors (Including Ground Floor)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Total Floors"
                    value={formData.totalFloors}
                    onChange={(e) =>
                      setFormData({ ...formData, totalFloors: e.target.value })
                    }
                    autoFocus
                    autoComplete="off"
                  />
                  {error.totalFloors && (
                    <div style={{ color: "red" }}>{error.totalFloors}</div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tenant Details</Form.Label>
                  <Form.Select
                    aria-label="Tenant Details"
                    value={formData.tenantType || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, tenantType: e.target.value })
                    }
                  >
                    <option>Select option</option>
                    {tenantMaster.map((tenant) => (
                      <option key={tenant.tenant_id} value={tenant.tenant_id}>
                        {tenant.tenant_category}
                      </option>
                    ))}
                  </Form.Select>
                  {error.tenantType && (
                    <div style={{ color: "red" }}>{error.tenantType}</div>
                  )}
                </Form.Group>
              </Col>

              <Typography variant="h5">Address Details</Typography>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Address"
                    value={formData.address}
                    onChange={(e) => {
                      setFormData({ ...formData, address: e.target.value });
                    }}
                  />
                  {error.address && (
                    <div style={{ color: "red" }}>{error.address}</div>
                  )}
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>State</Form.Label>
                  <Form.Select
                    aria-label="State"
                    value={formData.state_id || ""}
                    onChange={handleStateChange}
                  >
                    <option>Select option</option>
                    {stateMaster.map((state) => {
                      return (
                        <option key={state.state_id} value={state.state_id}>
                          {state.state_title}
                        </option>
                      );
                    })}
                  </Form.Select>
                  {error.state_id && (
                    <div style={{ color: "red" }}>{error.state_id}</div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>District</Form.Label>
                  <Form.Select
                    aria-label="District"
                    value={formData.dist_id || ""}
                    onChange={handleDistrictChange}
                  >
                    <option>Select option</option>

                    <>
                      <option value="">Select District</option>
                      {filterDist.length > 0 ? (
                        filterDist.map((dist) => (
                          <option value={dist.dist_id} key={dist.dist_id}>
                            {dist.dist_name}
                          </option>
                        ))
                      ) : formData.dist_id ? (
                        <option value={formData.dist_id} key={formData.dist_id}>
                          {formData.dist_name}
                        </option>
                      ) : (
                        <option disabled>No districts available</option>
                      )}
                    </>
                  </Form.Select>
                  {error.dist_id && (
                    <div style={{ color: "red" }}>{error.dist_id}</div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="City"
                    autoFocus
                    autoComplete="off"
                    value={formData.city}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        city: e.target.value,
                      });
                    }}
                  />

                  {error.city && (
                    <div style={{ color: "red" }}>{error.city}</div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Pincode</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Pincode"
                    autoFocus
                    autoComplete="off"
                    value={formData.pincode}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        pincode: e.target.value,
                      });
                    }}
                  />

                  {error.pincode && (
                    <div style={{ color: "red" }}>{error.pincode}</div>
                  )}
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            type="submit"
            style={{
              backgroundColor: "#37819d",
            }}
          >
            {mode === "edit" ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default HostelDetailModal;
