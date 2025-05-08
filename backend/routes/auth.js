import express from "express";
import authController from "../Controllers/authController.js";
import masterController from "../Controllers/masterController.js";
import protectRoute from "../middleware/authMiddlewaare.js";

const { signup, login, generateRefreshToken , logout } = authController;
const { getTenantMaster, getStateMaster , getDistrictMaster} = masterController;

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/tenant-master", protectRoute, getTenantMaster);
router.get("/state-master", protectRoute ,getStateMaster);
router.get("/district-master",protectRoute , getDistrictMaster);

router.get("/refresh", generateRefreshToken);
router.post("/logout" ,logout)

export default router;
