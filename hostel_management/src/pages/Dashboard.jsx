import React from "react";
import Sidebar from "../Components/Sidebar";
import { Box } from "@mui/material";

const Dashboard = () => {
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1, padding: 2 ,marginTop:7}}>
          <h1 style={{ textAlign: "center" }}>Dahboard</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam
            incidunt quo itaque repellendus omnis suscipit laudantium maxime
            debitis natus, doloribus, voluptatum dolor voluptates quaerat quia
            esse? Deleniti eligendi possimus magnam.
          </p>
        </Box>
      </Box>
    </>
  );
};

export default Dashboard;
