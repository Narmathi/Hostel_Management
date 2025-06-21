import React from "react";
import { Box, Typography } from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import Sidebar from "../Components/Sidebar";
import { Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import RoomAllocationModal from "../modals/RoomAllocationModal";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function RoomAllocation() {
  const navigate = useNavigate();
  const initialFormData = {
    id: "",
    hostel_id: "",
    floor_id: "",
    room_number: "",
    total_beds: "",
    type_id: "",
    rent_per_bed: "",
    total_rent: "",
    occupied_beds: "",
  };

  const [rowData, setRowData] = useState([]);
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState("add");
  const [formData, setFormData] = useState(initialFormData);
  const [hostel, setHostel] = useState([]);
  const [roomType, setRoomType] = useState([]);
  const [alert, setAlert] = useState({ type: "", message: "", show: false });

  const handleOpenAdd = () => {
    setMode("add");
    setFormData(initialFormData);
    setShow(true);
  };

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
              url: `${server}get-roomtype-master`,
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

  const handleSave = async (form) => {
    const server = import.meta.env.VITE_SERVER_URL;
    const token = localStorage.getItem("authToken");

    const url =
      mode === "add"
        ? `${server}insert-roomallocation`
        : `${server}update-roomallocation`;

    try {
      const response = await axios.post(url, form, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status == 200) {
        Swal.fire("Success!", response.data.message, "success");
        await getFloorDetails();
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

  return (
    <>
      <Box style={{ display: "flex" }}>
        <Sidebar />
        <Box className="global_box">
          <div className="ag-theme-alpine global_div">
            <Box className="inline_box_header">
              <Typography variant="h5" gutterBottom>
                Room Allocation
              </Typography>
              <Button className="global_button" onClick={handleOpenAdd}>
                Add Details
              </Button>

              <RoomAllocationModal
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

            {/* <AgGridReact
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
            )} */}
          </div>
        </Box>
      </Box>
    </>
  );
}
