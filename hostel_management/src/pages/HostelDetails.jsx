import React from "react";
import { useState, useEffect } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { Box, Typography } from "@mui/material";
import Sidebar from "../Components/Sidebar";
import { AgGridReact } from "ag-grid-react";
import { useNavigate } from "react-router-dom";
import { Alert } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import Modal from "react-bootstrap/Modal";
import Swal from "sweetalert2";

import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

import axios from "axios";
import {
  AllCommunityModule,
  ModuleRegistry,
  PaginationModule,
} from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule, PaginationModule]);
import HostelDetailModal from "../modals/HostelDetailModal";
import { Button } from "react-bootstrap";
import "../assets/styles/pages.css";
import { useMemo } from "react";

export default function HostelDetails() {
  const initialFormData = {
    id: "",
    hostelName: "",
    contactNumber: "",
    totalFloors: "",
    tenantType: "",
    address: "",
    state_id: "",
    dist_id: "",
    city: "",
    pincode: "",
  };

  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("add");
  const [formData, setFormData] = useState(initialFormData);
  const [tenantMaster, setTenantMaster] = useState([]);
  const [stateMaster, setStateMaster] = useState([]);
  const [districtMaster, setDistrictMaster] = useState([]);
  const [alert, setAlert] = useState({ type: "", message: "", show: false });
  const [rowData, setRowData] = useState([]);
  const [viewModal, setviewModal] = useState(false);
  const [addressModal, setAddressModal] = useState([]);

  // Column Definitions: Defines the columns to be displayed.
  const addcolumnDefs = [
    {
      field: "id",
      headerName: "ID",
      flex: 2,
      headerClass: "custom_header",
      cellClass: "custom_cell  ",
      hide: true,
    },
    {
      field: "state_id",
      headerName: "State ID",
      hide: true,
    },
    {
      field: "state_title",
      headerName: "State Title",
      hide: true,
    },
    {
      field: "dist_id",
      headerName: "District ID",
      hide: true,
    },
    {
      field: "dist_name",
      headerName: "District Name",
      hide: true,
    },
    {
      field: "city",
      headerName: "City",
      hide: true,
    },
    {
      field: "address",
      headerName: "Address",
      hide: true,
    },
    {
      field: "pincode",
      headerName: "Pincode",
      hide: true,
    },
    {
      field: "tenant",
      headerName: "Tenant",
      hide: true,
    },
    {
      field: "total_floors",
      headerName: "Total Floors",
      hide: true,
    },
    {
      field: "no",
      headerName: "S.no",
      flex: 2,
      headerClass: "custom_header",
      cellClass: "custom_cell  ",
    },
    {
      field: "hostel_name",
      headerName: "Hostel Name",
      flex: 2,
      headerClass: "custom_header",
      cellClass: "custom_cell  ",
    },
    {
      field: "contact_number",
      headerName: "Contact Number",
      flex: 2,
      headerClass: "custom_header",
      cellClass: "custom_cell  ",
    },
    {
      field: "total_floor",
      headerName: "Total Floors",
      flex: 2,
      headerClass: "custom_header",
      cellClass: "custom_cell  ",
    },
    {
      field: "address",
      headerName: "Address",
      flex: 2,
      headerClass: "custom_header",
      cellClass: "custom_cell  ",
      cellRenderer: IconCellRenderer,
    },
    {
      field: "action",
      headerName: "Action",
      flex: 2,
      headerClass: "custom_header",
      cellClass: "custom_cell  ",
      cellRenderer: IconCellRendererAction,
    },
  ];

  function IconCellRenderer(params) {
    const data = params.data;
    const handleView = async (data) => {
      setAddressModal({
        id: data.id,
        address: data.address,
        state_id: data.state_id,
        dist_id: data.dist_id,
        dist_name: data.dist_name,
        city: data.city,
        pincode: data.pincode,
        state_title: data.state_title,
      });
      setviewModal(true);
    };
    return (
      <>
        <button
          onClick={() => handleView(data)}
          style={{
            marginRight: 8,
            background: "none",
            border: "none",
            marginBottom: 3,
            color: "#0e92ad",
          }}
        >
          <FaEye /> View
        </button>
      </>
    );
  }

  function IconCellRendererAction(params) {
    const data = params.data;

    const handleDelete = async (data) => {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You want to delete it!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const hostelID = data.id;
        const server = import.meta.env.VITE_SERVER_URL;
        const token = localStorage.getItem("authToken");
        const url = `${server}delete-hosteldetails`;

        try {
          const response = await axios.post(
            url,
            { hostel_id: hostelID },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.status === 200) {
            Swal.fire("Deleted!", "Hostel has been deleted.", "success");

            await getHostelDetails();
            setShow(false);
          } else {
            const errorMsg =
              response.data?.message || "Failed to delete hostel!";
            setAlert({
              type: "danger",
              message: errorMsg,
              show: true,
            });
          }
        } catch (error) {
          const status = error.response?.status;

          if (status === 401) {
            console.error("Auth error, redirecting to login:", error.response);
            localStorage.removeItem("authToken");
            localStorage.removeItem("username");
            navigate("/login");
            return;
          }

          const errorMsg =
            error.response?.data?.message ||
            error.message ||
            "Something went wrong!";
          setAlert({
            type: "danger",
            message: errorMsg,
            show: true,
          });
        }
      }
    };

    return (
      <>
        <button
          onClick={() => handleOpenEdit(data)}
          style={{
            marginRight: 8,
            background: "none",
            border: "none",
            marginBottom: 3,
            color: "#37759d",
          }}
        >
          <FaEdit />
        </button>
        <button
          type="button"
          onClick={() => handleDelete(data)}
          style={{
            marginRight: 8,
            background: "none",
            border: "none",
            marginBottom: 3,
            color: "#eb1b1b",
          }}
        >
          <FaTrash />
        </button>
      </>
    );
  }

  const defaultColDef = useMemo(() => {
    return {
      editable: true,
      filter: true,
      sortable: true,
      flex: 1,
      minWidth: 100,
    };
  }, []);

  const rowSelection = useMemo(() => "multiple", []);

  const handleOpenAdd = () => {
    setMode("add");
    setFormData(initialFormData);
    setShow(true);
  };

  const handleOpenEdit = (data) => {
    setMode("edit");
    setFormData({
      id: data.id,
      hostelName: data.hostel_name,
      contactNumber: data.contact_number,
      totalFloors: data.total_floors,
      tenantType: data.tenant,
      address: data.address,
      state_id: data.state_id,
      dist_id: data.dist_id,
      dist_name: data.dist_name,
      city: data.city,
      pincode: data.pincode,
    });
    setShow(true);
  };

  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert((prev) => ({ ...prev, show: false }));
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [alert.show]);

  const handleSave = async (form) => {
    const server = import.meta.env.VITE_SERVER_URL;
    const token = localStorage.getItem("authToken");

    const url =
      mode === "add"
        ? `${server}insert-hosteldetails`
        : `${server}update-hosteldetails`;

    try {
      const response = await axios.post(url, form, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status == 200) {
        console.log(response);
        Swal.fire("Success!", response.data.message, "success");
        await getHostelDetails();
        setShow(false);
      } else {
        const errorMsg =
          error.response?.data?.message || "Hostel Already exist!";
        Swal.fire("Failure!", errorMsg, "danger");
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 401) {
        console.error("Retry after refresh failed:", error.response);
        localStorage.removeItem("authToken");
        localStorage.removeItem("username");
        navigate("/login");
      }
      if (status == 400 || status == 500) {
        const errorMsg =
          error.response?.data?.message || "Something went wrong!";
        Swal.fire("Failure!", errorMsg, "info");
      }
    }
  };
  // get all the datas
  const getHostelDetails = async () => {
    const server = import.meta.env.VITE_SERVER_URL;
    const url = `${server}get-hosteldetails`;
    const token = localStorage.getItem("authToken");

    try {
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status == 200) {
        const hostelDetails = response.data;

        const finalResult = hostelDetails.map((hostel, index) => ({
          id: hostel.hostel_id,
          no: index + 1,
          hostel_name: hostel.hostel_name,
          contact_number: hostel.contact_number,
          total_floor: hostel.total_floors,
          state_id: hostel.state,
          state_title: hostel.state_title,
          dist_id: hostel.district,
          dist_name: hostel.dist_name,
          city: hostel.city,
          pincode: hostel.pincode,
          total_floors: hostel.total_floors,
          tenant: hostel.tenant,
          address: hostel.address,
        }));

        setRowData(finalResult);
        setAlert({
          type: "success",
          message: "Data Fetched Successfully",
          show: true,
        });
      } else {
        setAlert({
          type: "danger",
          message: "Failed to fetch data",
          show: true,
        });
        setRowData([]);
      }
    } catch (error) {
      const status = error.response?.status;
      console.log(status);
      const errorMsg = error.response?.data?.message || "Something went wrong!";
      if (status === 401) {
        console.error("Retry after refresh failed:", error.response);
        localStorage.removeItem("authToken");
        localStorage.removeItem("username");
        navigate("/login");
      }

      if (status === 400) {
        Swal.fire("Failure!", errorMsg, "warning");
      } else if (status === 500) {
        Swal.fire("Server Error!", "Please try again later.", "error");
      } else {
        Swal.fire("Error", errorMsg, "error");
      }
    }
  };

  useEffect(() => {
    if (show) {
      const server = import.meta.env.VITE_SERVER_URL;

      const fetchAll = async () => {
        try {
          await Promise.allSettled([
            fetchData({
              url: `${server}tenant-master`,
              setData: setTenantMaster,
              navigate,
            }),
            fetchData({
              url: `${server}state-master`,
              setData: setStateMaster,
              navigate,
            }),
            fetchData({
              url: `${server}district-master`,
              setData: setDistrictMaster,
              navigate,
            }),
          ]);
        } catch (error) {
          console.error("Error while fetching all data:", error);
        }
      };

      fetchAll();
    }
  }, [show]);

  const fetchData = async ({ url, setData, navigate }) => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setData(response.data.data);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        console.error("Retry after refresh failed:", error.response);
        localStorage.removeItem("authToken");
        localStorage.removeItem("username");
        navigate("/login");
      } else {
        console.error("Error fetching tenant master:", error);
      }
    }
  };

  useEffect(() => {
    getHostelDetails();
  }, []);

  return (
    <>
      <Box style={{ display: "flex", position: "relative" }}>
        <Sidebar />
        <Box className="global_box">
          <div className="ag-theme-alpine global_div">
            <Box className="inline_box_header">
              <Typography variant="h5" gutterBottom>
                Hostel Details
              </Typography>
              <Button className="global_button" onClick={handleOpenAdd}>
                Add Hostel
              </Button>

              <HostelDetailModal
                show={show}
                handleClose={() => setShow(false)}
                handleSave={handleSave}
                mode={mode}
                formData={formData}
                setFormData={setFormData}
                tenantMaster={tenantMaster}
                stateMaster={stateMaster}
                distMaster={districtMaster}
              />
            </Box>

            <AgGridReact
              rowData={rowData}
              columnDefs={addcolumnDefs}
              defaultColDef={defaultColDef}
              rowSelection={rowSelection}
              pagination={true}
            />
            {alert.show && (
              <Alert
                variant={alert.type}
                onClose={() => setAlert({ ...alert, show: false })}
                dismissible
                className="alert_box"
              >
                <p>{alert.message}</p>
              </Alert>
            )}
          </div>

          <Modal show={viewModal} centered size="lg">
            <Modal.Header>
              <Modal.Title>Address Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={addressModal.address}
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>State</Form.Label>
                      <Form.Select aria-label="State">
                        {addressModal.state_id != "" ? (
                          <option
                            value={addressModal.state_id}
                            key={addressModal.state_id}
                          >
                            {addressModal.state_title}
                          </option>
                        ) : (
                          <option disabled>No districts available</option>
                        )}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>District</Form.Label>
                      <Form.Select aria-label="District">
                        {addressModal.dist_id != "" ? (
                          <option
                            value={addressModal.dist_id}
                            key={addressModal.dist_id}
                          >
                            {addressModal.dist_name}
                          </option>
                        ) : (
                          <option disabled>No districts available</option>
                        )}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>City</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="City"
                        value={addressModal.city}
                        readOnly
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Pincode</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Pincode"
                        value={addressModal.pincode}
                        readOnly
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                style={{ background: "#0e92ad" }}
                onClick={() => setviewModal(false)}
              >
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </Box>
      </Box>
    </>
  );
}
