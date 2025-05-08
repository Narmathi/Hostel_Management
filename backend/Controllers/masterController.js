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

export default { getTenantMaster, getStateMaster ,getDistrictMaster };
