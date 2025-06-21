import React from "react";
import { Box, Typography } from "@mui/material";
import { Button } from "react-bootstrap";
import "../assets/styles/pages.css";
import { AgGridReact } from "ag-grid-react";
import Sidebar from "../Components/Sidebar";
import { Form, Row, Col } from "react-bootstrap";
import { useState, useMemo, useEffect } from "react";
import RoomManageModal from "../modals/RoomManageModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { Alert } from "react-bootstrap";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

export default function RoomManagement() {
  const initialFormData = {
    id: "",
    hostel_id: "",
    type_id: "",
    advance_amount: "",
    total_rent: "",
    monthly_rent_person: "",
    daily_rent_person: "",
    weekly_rent_person: "",
    hostel_name: "",
    type_name: "",
  };

  const [rowData, setRowData] = useState([]);
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("add");
  const [formData, setFormData] = useState(initialFormData);
  const [hostel, setHostel] = useState([]);
  const [roomType, setRoomType] = useState([]);
  const [alert, setAlert] = useState({ type: "", message: "", show: false });

  const navigate = useNavigate();

  const defaultColDef = useMemo(() => {
    return {
      editable: true,
      filter: true,
      sortable: true,
      flex: 1,
      minWidth: 100,
    };
  }, []);

  const addcolumnDefs = [
    {
      field: "id",
      headerName: "Room master",
      hide: true,
    },
    {
      field: "hostel_id",
      headerName: "Hostel",
      hide: true,
    },
    {
      field: "type_id",
      headerName: "type_id",
      hide: true,
    },
    {
      field: "no",
      headerName: "S.no",
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
      field: "type_name",
      headerName: "Room_type",
      flex: 2,
      headerClass: "custom_header",
      cellClass: "custom_cell  ",
    },
    {
      field: "total_monthly_rent",
      headerName: "Total Rent",
      flex: 2,
      headerClass: "custom_header",
      cellClass: "custom_cell  ",
    },
    {
      field: "rent_per_person",
      headerName: "Monthly Rent",
      flex: 2,
      headerClass: "custom_header",
      cellClass: "custom_cell  ",
    },
    {
      field: "daily_rent_person",
      headerName: "Daily Rent",
      flex: 2,
      headerClass: "custom_header",
      cellClass: "custom_cell  ",
    },
    {
      field: "weekly_rent_person",
      headerName: "Weekly Rent",
      flex: 2,
      headerClass: "custom_header",
      cellClass: "custom_cell  ",
    },
    {
      field: "advance_amount",
      headerName: "Advance",
      flex: 2,
      headerClass: "custom_header",
      cellClass: "custom_cell  ",
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
        const rooomID = data.id;
        const server = import.meta.env.VITE_SERVER_URL;
        const token = localStorage.getItem("authToken");
        const url = `${server}delete-roomdetails`;

        try {
          const response = await axios.post(
            url,
            { room_id: rooomID },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.status === 200) {
            Swal.fire(
              "Deleted!",
              response.data?.message || "Data deleted successfully",
              "success"
            );

            await getRoomDetails();
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

    const handleOpenEdit = (data) => {
      setMode("edit");
      setFormData({
        id: data.id,
        hostel_id: data.hostel_id,
        type_id: data.type_id,
        advance_amount: data.advance_amount,
        total_rent: data.total_monthly_rent,
        monthly_rent_person: data.rent_per_person,
        daily_rent_person: data.daily_rent_person,
        weekly_rent_person: data.weekly_rent_person,
        hostel_name: data.hostel_name,
        type_name: data.type_name,
      });
      setShow(true);
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

  useEffect(() => {
    if (show) {
      const server = import.meta.env.VITE_SERVER_URL;

      const fetchAll = async () => {
        try {
          await Promise.allSettled([
            fetchData({
              url: `${server}hostel`,
              setData: setHostel,
              navigate,
            }),
            fetchData({
              url: `${server}room-type`,
              setData: setRoomType,
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

  const handleOpenAdd = () => {
    setMode("add");
    setFormData(initialFormData);
    setShow(true);
  };

  const handleSave = async (form) => {
    const server = import.meta.env.VITE_SERVER_URL;
    const token = localStorage.getItem("authToken");

    const url =
      mode === "add"
        ? `${server}insert-roomdetails`
        : `${server}update-roomdetails`;

    try {
      const response = await axios.post(url, form, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        console.log(response);
        Swal.fire("Success!", response.data.message, "success");
        await getRoomDetails();
        setShow(false);
      }
    } catch (error) {
      const status = error.response?.status;
      const errorMsg = error.response?.data?.message || "Something went wrong!";

      if (status === 401) {
        console.error("Unauthorized. Redirecting to login.");
        localStorage.removeItem("authToken");
        localStorage.removeItem("username");
        navigate("/login");
        return;
      }

      if (status === 400) {
        Swal.fire("Failure!", errorMsg, "warning");
      } else if (status === 500) {
        0.0 - Swal.fire("Server Error!", "Please try again later.", "error");
      } else {
        Swal.fire("Error", errorMsg, "error");
      }
    }
  };

  const getRoomDetails = async () => {
    const server = import.meta.env.VITE_SERVER_URL;
    const url = `${server}get-roomdetails`;
    const token = localStorage.getItem("authToken");

    try {
      const response = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status == 200) {
        const roomDetails = response.data;

        const finalResult = roomDetails.map((hostel, index) => ({
          id: hostel.room_master_id,
          no: index + 1,
          hostel_name: hostel.hostel_name,
          hostel_id: hostel.hostel,
          advance_amount: hostel.advance_amount,
          total_monthly_rent: hostel.total_monthly_rent,
          rent_per_person: hostel.rent_per_person,
          daily_rent_person: hostel.daily_rent_person,
          weekly_rent_person: hostel.weekly_rent_person,
          type_name: hostel.type_name,
          type_id: hostel.type_id,
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
      if (error.response?.status === 401) {
        console.error("Retry after refresh failed:", error.response);
        localStorage.removeItem("authToken");
        localStorage.removeItem("username");
        navigate("/login");
      } else {
        console.error("Error while fetching all data:", error);
        setAlert({
          type: "danger",
          message: error,
          show: true,
        });
      }
    }
  };

  useEffect(() => {
    getRoomDetails();
  }, []);

  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => {
        setAlert((prev) => ({ ...prev, show: false }));
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [alert.show]);

  return (
    <>
      <Box style={{ display: "flex", position: "relative" }}>
        <Sidebar />
        <Box className="global_box">
          <div className="ag-theme-alpine global_div">
            <Box className="inline_box_header">
              <Typography variant="h5" gutterBottom>
                Room management
              </Typography>
              <Button className="global_button" onClick={handleOpenAdd}>
                Add Details
              </Button>

              <RoomManageModal
                show={show}
                handleClose={() => setShow(false)}
                handleSave={handleSave}
                mode={mode}
                formData={formData}
                setFormData={setFormData}
                hostel={hostel}
                roomType={roomType}
              />
            </Box>

            <AgGridReact
              rowData={rowData}
              columnDefs={addcolumnDefs}
              defaultColDef={defaultColDef}
              rowSelection="multiple"
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
        </Box>
      </Box>
    </>
  );
}
