import React from "react";
import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import Sidebar from "../Components/Sidebar";
import { AgGridReact } from "ag-grid-react";
import { useNavigate } from "react-router-dom";

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

  const [rowData, setRowData] = useState([
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
    { make: "Mercedes", model: "EQA", price: 48890, electric: true },
    { make: "Fiat", model: "500", price: 15774, electric: false },
    { make: "Nissan", model: "Juke", price: 20675, electric: false },
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
    { make: "Mercedes", model: "EQA", price: 48890, electric: true },
    { make: "Fiat", model: "500", price: 15774, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
    { make: "Mercedes", model: "EQA", price: 48890, electric: true },
    { make: "Fiat", model: "500", price: 15774, electric: false },
    { make: "Nissan", model: "Juke", price: 20675, electric: false },
    { make: "Fiat", model: "500", price: 15774, electric: false },
    { make: "Nissan", model: "Juke", price: 20675, electric: false },
    { make: "Nissan", model: "Juke", price: 20675, electric: false },
    { make: "Nissan", model: "Juke", price: 20675, electric: false },
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
    { make: "Mercedes", model: "EQA", price: 48890, electric: true },
    { make: "Fiat", model: "500", price: 15774, electric: false },
    { make: "Nissan", model: "Juke", price: 20675, electric: false },
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
    { make: "Mercedes", model: "EQA", price: 48890, electric: true },
    { make: "Fiat", model: "500", price: 15774, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
    { make: "Mercedes", model: "EQA", price: 48890, electric: true },
    { make: "Fiat", model: "500", price: 15774, electric: false },
    { make: "Nissan", model: "Juke", price: 20675, electric: false },
    { make: "Fiat", model: "500", price: 15774, electric: false },
    { make: "Nissan", model: "Juke", price: 20675, electric: false },
    { make: "Nissan", model: "Juke", price: 20675, electric: false },
    { make: "Nissan", model: "Juke", price: 20675, electric: false },
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
    { make: "Mercedes", model: "EQA", price: 48890, electric: true },
    { make: "Fiat", model: "500", price: 15774, electric: false },
    { make: "Nissan", model: "Juke", price: 20675, electric: false },
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
    { make: "Mercedes", model: "EQA", price: 48890, electric: true },
    { make: "Fiat", model: "500", price: 15774, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
    { make: "Mercedes", model: "EQA", price: 48890, electric: true },
    { make: "Fiat", model: "500", price: 15774, electric: false },
    { make: "Nissan", model: "Juke", price: 20675, electric: false },
    { make: "Fiat", model: "500", price: 15774, electric: false },
    { make: "Nissan", model: "Juke", price: 20675, electric: false },
    { make: "Nissan", model: "Juke", price: 20675, electric: false },
    { make: "Nissan", model: "Juke", price: 20675, electric: false },
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
    { make: "Mercedes", model: "EQA", price: 48890, electric: true },
    { make: "Fiat", model: "500", price: 15774, electric: false },
    { make: "Nissan", model: "Juke", price: 20675, electric: false },
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
    { make: "Mercedes", model: "EQA", price: 48890, electric: true },
    { make: "Fiat", model: "500", price: 15774, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
    { make: "Mercedes", model: "EQA", price: 48890, electric: true },
    { make: "Fiat", model: "500", price: 15774, electric: false },
    { make: "Nissan", model: "Juke", price: 20675, electric: false },
    { make: "Fiat", model: "500", price: 15774, electric: false },
    { make: "Nissan", model: "Juke", price: 20675, electric: false },
    { make: "Nissan", model: "Juke", price: 20675, electric: false },
    { make: "Nissan", model: "Juke", price: 20675, electric: false },
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
    { make: "Mercedes", model: "EQA", price: 48890, electric: true },
    { make: "Fiat", model: "500", price: 15774, electric: false },
    { make: "Nissan", model: "Juke", price: 20675, electric: false },
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
    { make: "Mercedes", model: "EQA", price: 48890, electric: true },
    { make: "Fiat", model: "500", price: 15774, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
    { make: "Mercedes", model: "EQA", price: 48890, electric: true },
    { make: "Fiat", model: "500", price: 15774, electric: false },
    { make: "Nissan", model: "Juke", price: 20675, electric: false },
    { make: "Fiat", model: "500", price: 15774, electric: false },
    { make: "Nissan", model: "Juke", price: 20675, electric: false },
    { make: "Nissan", model: "Juke", price: 20675, electric: false },
    { make: "Nissan", model: "Juke", price: 20675, electric: false },
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
    { make: "Mercedes", model: "EQA", price: 48890, electric: true },
    { make: "Fiat", model: "500", price: 15774, electric: false },
    { make: "Nissan", model: "Juke", price: 20675, electric: false },
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
    { make: "Mercedes", model: "EQA", price: 48890, electric: true },
    { make: "Fiat", model: "500", price: 15774, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
    { make: "Mercedes", model: "EQA", price: 48890, electric: true },
    { make: "Fiat", model: "500", price: 15774, electric: false },
    { make: "Nissan", model: "Juke", price: 20675, electric: false },
    { make: "Fiat", model: "500", price: 15774, electric: false },
    { make: "Nissan", model: "Juke", price: 20675, electric: false },
    { make: "Nissan", model: "Juke", price: 20675, electric: false },
    { make: "Nissan", model: "Juke", price: 20675, electric: false },
  ]);

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState([
    { field: "make" },
    { field: "model" },
    { field: "price" },
    { field: "electric" },
  ]);

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

  const handleOpenEdit = (hostel) => {
    setMode("edit");
    setFormData(hostel);
    setShow(true);
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

  return (
    <>
      <Box style={{ display: "flex" }}>
        <Sidebar />
        <Box className="global_box">
          <div className="ag-theme-alpine global_div">
            <Box className="inline_box_header">
              <Typography variant="h5" gutterBottom>
                {" "}
                Hostel Details{" "}
              </Typography>
              <Button className="global_button" onClick={handleOpenAdd}>
                {" "}
                Add Hostel
              </Button>

              <HostelDetailModal
                show={show}
                handleClose={() => setShow(false)}
                handleSave={() => {
                  /* Save or update */
                }}
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
              columnDefs={colDefs}
              defaultColDef={defaultColDef}
              rowSelection={rowSelection}
              pagination={true}
            />
          </div>
        </Box>
      </Box>
    </>
  );
}
