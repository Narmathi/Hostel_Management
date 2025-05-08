import React from "react";
import { Box } from "@mui/material";
import Sidebar from "../Components/Sidebar";

export default function RoomManagement() {
  return (
    <>
      <Box style={{ display: "flex" }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1, padding: 2, marginTop: 7 }}>
          <h1 style={{ textAlign: "center" }}>Room Management</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam
            incidunt quo itaque repellendus omnis suscipit laudantium maxime
            debitis natus, doloribus, voluptatum dolor voluptates quaerat quia
            esse? Deleniti eligendi possimus magnam.
          </p>
          <h3>Hostel Details</h3>
        </Box>
      </Box>
    </>
  );
}
