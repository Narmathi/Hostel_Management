import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import HostelDetails from "./pages/HostelDetails";
import RoomManagement from "./pages/RoomManagement";
import FloorAllocation from "./pages/FloorAllocation";
import RoomAllocation from "./pages/RoomAllocation";
import BedAllocation from "./pages/BedAllocation";
import ProtectedRoute from "./pages/ProtectedRoute";


import "./App.css";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={  <ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route
            path="/managehostel/hosteldetails"
            element={<ProtectedRoute><HostelDetails /></ProtectedRoute>}
          />
          <Route
            path="/managehostel/roommanagement"
            element={<ProtectedRoute><RoomManagement /></ProtectedRoute>}
          />
          <Route
            path="/managefloors/floorallocation"
            element={<ProtectedRoute><FloorAllocation /></ProtectedRoute>}
          />
          <Route 
          path ="/managerooms/roomallocation" 
          element= {<ProtectedRoute><RoomAllocation/></ProtectedRoute>}/>
           <Route 
          path ="/managerooms/bedallocation" 
          element= {<ProtectedRoute><BedAllocation/></ProtectedRoute>}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
