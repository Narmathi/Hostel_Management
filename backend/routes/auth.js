import express from "express";
import authController from "../Controllers/authController.js";
import masterController from "../Controllers/masterController.js";
import protectRoute from "../middleware/authMiddlewaare.js";
import hostelDetails from "../Controllers/hostelDetails.js";
import RoomManageController from "../Controllers/RoomManageController.js";
import floorController from "../Controllers/floorController.js";
import roomAllocation from "../Controllers/roomAllocation.js";

const { signup, login, generateRefreshToken, logout } = authController;
const {
  getTenantMaster,
  getStateMaster,
  getDistrictMaster,
  getFloorMaster,
  getRoomtypeMaster,
} = masterController;
const {
  insertFloorDetails,
  getFloorDetails,
  updateFloorDetails,
  deleteFloorDetails,
} = floorController;

const {
  insertHostelDetails,
  gettHostelDetails,
  deleteHostelDetails,
  updateHostelDetails,
} = hostelDetails;
const {
  getHostel,
  getRoomType,
  insertRoomDetails,
  getRoomDetails,
  deleteRoomDetails,
  updateRoomDetails,
} = RoomManageController;

const { insertRoomAllocation ,getRoomtype} = roomAllocation;

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/tenant-master", protectRoute, getTenantMaster);
router.get("/state-master", protectRoute, getStateMaster);
router.get("/district-master", protectRoute, getDistrictMaster);
router.post("/get-floor-master", protectRoute, getFloorMaster);
router.get("/get-roomtype-master", protectRoute, getRoomtypeMaster);

router.post("/insert-hosteldetails", protectRoute, insertHostelDetails);
router.get("/get-hosteldetails", protectRoute, gettHostelDetails);
router.post("/delete-hosteldetails", protectRoute, deleteHostelDetails);
router.post("/update-hosteldetails", protectRoute, updateHostelDetails);

// Room Mnagement
router.get("/hostel", protectRoute, getHostel);
router.get("/room-type", protectRoute, getRoomType);
router.post("/insert-roomdetails", protectRoute, insertRoomDetails);
router.get("/get-roomdetails", protectRoute, getRoomDetails);
router.post("/delete-roomdetails", protectRoute, deleteRoomDetails);
router.post("/update-roomdetails", protectRoute, updateRoomDetails);

// Floor Management
router.post("/insert-floor-details", protectRoute, insertFloorDetails);
router.get("/get-floordetails", protectRoute, getFloorDetails);
router.post("/update-floor-details", protectRoute, updateFloorDetails);
router.post("/delete-floor-details", protectRoute, deleteFloorDetails);

// Room Allocation
router.post("/insert-roomallocation", protectRoute, insertRoomAllocation);
router.post("/get-roomtype", protectRoute, getRoomtype);

router.get("/refresh", generateRefreshToken);
router.post("/logout", logout);

export default router;
