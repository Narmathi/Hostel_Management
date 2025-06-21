import React from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Typography } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";

const FloorAllocationModal = ({
  show,
  handleClose,
  handleSave,
  mode,
  formData,
  setFormData,
  hostel,
}) => {
  const title = mode === "edit" ? "Edit Floor Details" : "Add Floor Details";

  const [filterFloor, setFloor] = useState([]);
  const defaultError = {
    hostel_id: "",
    floor_id: "",
    total_rooms: "",
  };
  const [error, setError] = useState({
    defaultError,
  });

  useEffect(() => {
    if (show) {
      setError(defaultError);
    }
  }, [show, mode]);

  useEffect(() => {
    const fetchData = async () => {
      const server = import.meta.env.VITE_SERVER_URL;
      const token = localStorage.getItem("authToken");
      const url = `${server}get-floor-master`;

      console.log(formData.hostel_id);

      if (formData.hostel_id) {
        try {
          const response = await axios.post(
            url,
            { hostel_id: formData.hostel_id },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.status === 200) {
            setFloor(response.data.data);
          } else {
            const errorMsg =
              response.data?.message || "Failed to delete hostel!";
          }
        } catch (error) {
          console.error("Error fetching floor master data:", error);
        }
      }
    };

    fetchData();
  }, [formData.hostel_id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validForm()) {
      handleSave(formData);
    }
  };

  const validForm = () => {
    let isValid = true;
    let newError = {};

    if (!formData.hostel_id) {
      newError.hostel_id = "Please select hostel";
      isValid = false;
    }
    if (!formData.floor_id) {
      newError.floor_id = "Please select floor";
      isValid = false;
    }
    if (!formData.total_rooms) {
      newError.total_rooms = "Please Enter Total Rooms";
      isValid = false;
    }

    setError(newError);
    return isValid;
  };
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
                  <Form.Label>Select Hostel</Form.Label>
                  <Form.Select
                    aria-label="hostel"
                    value={formData.hostel_id || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, hostel_id: e.target.value })
                    }
                  >
                    <option>Select Option</option>
                    {hostel.map((hostel) => {
                      return (
                        <option key={hostel.hostel_id} value={hostel.hostel_id}>
                          {hostel.hostel_name}
                        </option>
                      );
                    })}
                  </Form.Select>
                  {error.hostel_id && (
                    <div style={{ color: "red" }}>{error.hostel_id}</div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Select Floors</Form.Label>
                  <Form.Select
                    aria-label="room_type"
                    value={formData.floor_id || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, floor_id: e.target.value })
                    }
                  >
                    <option>Select option</option>
                    {filterFloor.length > 0 &&
                      filterFloor.map((floor) => {
                        return (
                          <option key={floor.id} value={floor.id}>
                            {floor.floor_name}
                          </option>
                        );
                      })}
                  </Form.Select>
                  {error.floor_id && (
                    <div style={{ color: "red" }}>{error.floor_id}</div>
                  )}
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Total Rooms</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Total Rooms"
                    value={formData.total_rooms}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        total_rooms: e.target.value,
                      });
                    }}
                  />

                  {error.total_rooms && (
                    <div style={{ color: "red" }}>{error.total_rooms}</div>
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
            type="submit"
            style={{
              backgroundColor: "#37819d",
            }}
            onClick={handleSubmit}
          >
            {mode === "edit" ? "Update" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FloorAllocationModal;
