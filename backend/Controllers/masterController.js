import db from "../config/database.js";

const getTenantMaster = async (req, res) => {
  try {
    const query = `SELECT * FROM tenant_master WHERE flag = 1`;
    const [rows] = await db.query(query);

    return res.status(200).json({
      message: "Tenant data fetched successfully",
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching tenant master:", error.message);

    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

const getStateMaster = async (req, res) => {
  try {
    const query =
      "SELECT `state_id`,`state_title` FROM `tbl_state_master` WHERE 1";
    const [rows] = await db.query(query);
    console.log(rows);

    return res.status(200).json({
      message: "Data fetched successfully",
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching data:", error.message);

    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

const getDistrictMaster = async (req, res) => {
  try {
    const query =
      "SELECT `dist_id` ,`dist_name`,`state_id` FROM `tbl_dist_master` WHERE 1";
    const [rows] = await db.query(query);

    return res.status(200).json({
      message: "Data fetched successfully",
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching data:", error.message);

    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

const getFloorMaster = async (req, res) => {
  const { hostel_id } = req.body;
  try {
    const query =
      "SELECT  `total_floors`  FROM `tbl_hostel_master` WHERE `flag` = 1 and `hostel_id` = ?";
    const [rows] = await db.query(query, [hostel_id]);

    const floorsCount = rows[0]?.total_floors;

    const query2 =
      "SELECT `id`,`floor_name` FROM `floor_name` WHERE `flag` =  1";
    const [getFloors] = await db.query(query2);

  
    const selectedFloors = [];
    for (let i = 0; i < floorsCount; i++) {
      if (getFloors[i] != undefined && getFloors[i] != null) {
        selectedFloors.push(getFloors[i]);
      }
    }

  
    return res.status(200).json({
      message: "Data fetched successfully",
      success: true,
      data: selectedFloors,
    });
  } catch (error) {
    console.error("Error fetching data:", error.message);

    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};


const getRoomtypeMaster = async (req, res) => {
  try {
    const query =
      "SELECT `type_id`,`type_name` FROM `room_type` WHERE flag=1";
    const [rows] = await db.query(query);
    console.log(rows);

    return res.status(200).json({
      message: "Data fetched successfully",
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching data:", error.message);

    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};
export default {
  getTenantMaster,
  getStateMaster,
  getDistrictMaster,
  getFloorMaster,
  getRoomtypeMaster
};
