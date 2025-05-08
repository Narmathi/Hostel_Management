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

  const handleStateChange = (e) => {
    const stateID = e.target.value;
    console.log(stateID);

    setFormData((prev) => ({
      ...prev,
      state_id: stateID,
      dist_id: "",
    }));

    const districts = distMaster.filter((dist) => dist.state_id == stateID);
    setFilterDist(districts);
  };

  const handleDistrictChange = (e) => {
    const distID = e.target.value;

    setFormData((prev) => ({
      ...prev,
      dist_id: distID,
    }));
  };

  // for Edit
  useEffect(() => {
    if (formData.state_id) {
      const filtered = distMaster.filter(
        (dist) => dist.state_id === formData.state_id
      );
      setFilterDist(filtered);
    }
  }, [formData.state_id, distMaster]);

  return (
    <>
      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Basic Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>{title}</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.hostelName}
                    onChange={(e) =>
                      setFormData({ ...formData, hostelName: e.target.value })
                    }
                    placeholder="Hostel Name"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Contact Number</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.contactNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contactNumber: e.target.value,
                      })
                    }
                    placeholder="Contact Number"
                    autoFocus
                    autoComplete="off"
                  />
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
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tenant Details</Form.Label>
                  <Form.Select aria-label="Tenant Details">
                    <option>Select option</option>
                    {tenantMaster.map((tenant) => (
                      <option key={tenant.tenant_id} value={tenant.tenant_id}>
                        {tenant.tenant_category}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Typography variant="h5">Address Details</Typography>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control as="textarea" rows={3} />
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
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>District</Form.Label>
                  <Form.Select
                    aria-label="District"
                    value={formData.dist_id}
                    onChange={handleDistrictChange}
                  >
                    <option>Select option</option>
                    {console.log(filterDist)}
                    {filterDist.map((dist) => {
                      return (
                        <option value={dist.dist_id} key={dist.dist_id}>
                          {dist.dist_name}
                        </option>
                      );
                    })}
                  </Form.Select>
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
                  />
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
                  />
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
            style={{
              backgroundColor: "#37819d",
            }}
            onClick={handleClose}
          >
            {mode === "edit" ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default HostelDetailModal;
