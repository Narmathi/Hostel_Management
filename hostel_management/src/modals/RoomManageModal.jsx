import React from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Typography } from "@mui/material";
import { useState, useEffect } from "react";

const RoomManageModal = ({
  show,
  handleClose,
  handleSave,
  mode,
  formData,
  setFormData,
  hostel,
  roomType,
}) => {
  const title = mode === "edit" ? "Edit Room Details" : "Add Room Details";

  const defaultError = {
    hostel_id: "",
    type_id: "",
    advance_amount: "",
    total_rent: "",
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
    const roomType = parseInt(formData.type_id);
    const rent = parseInt(formData.total_rent);

    if (!roomType || !rent || rent <= 0) return;
    let dailyCharge = 0;
    let weeklyCharge = 0;
    let monthlyCharge = 0;

    if (roomType === 1) {
      dailyCharge = rent / 30;
      weeklyCharge = dailyCharge * 7;
      monthlyCharge = rent;
    } else if (roomType === 2) {
      monthlyCharge = rent / 2;
      dailyCharge = monthlyCharge / 30;
      weeklyCharge = dailyCharge * 7;
    } else if (roomType === 3) {
      monthlyCharge = rent / 3;
      dailyCharge = monthlyCharge / 30;
      weeklyCharge = dailyCharge * 7;
    }

    setFormData((prev) => ({
      ...prev,
      monthly_rent_person: Math.round(monthlyCharge),
      daily_rent_person: Math.round(dailyCharge),
      weekly_rent_person: Math.round(weeklyCharge),
    }));
  }, [formData.total_rent, formData.type_id]);

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
    if (!formData.type_id) {
      newError.type_id = "Please select roomtype";
      isValid = false;
    }
    if (!formData.advance_amount) {
      newError.advance_amount = "Please Enter advance amount";
      isValid = false;
    }
    if (!formData.total_rent) {
      newError.total_rent = "Please Enter Rent amount";
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
                  <Form.Label>Hostel Name</Form.Label>
                  <Form.Select
                    aria-label="hostel"
                    value={formData.hostel_id || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, hostel_id: e.target.value })
                    }
                  >
                    <option>Select option</option>
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
                  <Form.Label>Room Type</Form.Label>
                  <Form.Select
                    aria-label="room_type"
                    value={formData.type_id || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, type_id: e.target.value })
                    }
                  >
                    <option>Select option</option>
                    {roomType.map((type) => {
                      return (
                        <option key={type.type_id} value={type.type_id}>
                          {type.type_name}
                        </option>
                      );
                    })}
                  </Form.Select>
                  {error.type_id && (
                    <div style={{ color: "red" }}>{error.type_id}</div>
                  )}
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Advance Amount</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Advance Amount"
                    autoFocus
                    autoComplete="off"
                    value={formData.advance_amount}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        advance_amount: e.target.value,
                      });
                    }}
                  />

                  {error.advance_amount && (
                    <div style={{ color: "red" }}>{error.advance_amount}</div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Rent Amount</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Rent Amount"
                    autoFocus
                    autoComplete="off"
                    value={formData.total_rent}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        total_rent: e.target.value,
                      });
                    }}
                  />

                  {error.total_rent && (
                    <div style={{ color: "red" }}>{error.total_rent}</div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Monthly Rent (per person)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Monthly Rent"
                    autoFocus
                    autoComplete="off"
                    value={formData.monthly_rent_person}
                    readOnly
                  />

                  {/* {error.pincode && (
                    <div style={{ color: "red" }}>{error.pincode}</div>
                  )} */}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Daily Charge (per Person)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Daily Charge"
                    autoFocus
                    autoComplete="off"
                    value={formData.daily_rent_person}
                    readOnly
                  />

                  {/* {error.pincode && (
                    <div style={{ color: "red" }}>{error.pincode}</div>
                  )} */}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Weekly Charge (per Person)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Weekly Charge"
                    autoFocus
                    autoComplete="off"
                    value={formData.weekly_rent_person}
                    readOnly
                  />
                  {/* 
                  {error.pincode && (
                    <div style={{ color: "red" }}>{error.pincode}</div>
                  )} */}
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

export default RoomManageModal;
