import db from "../config/database.js";

const insertHostelDetails = async (req, res) => {
  const {
    hostelName,
    contactNumber,
    totalFloors,
    tenantType,
    address,
    state_id,
    dist_id,
    city,
    pincode,
  } = req.body;

  const hostel_name = req.body.hostelName;

  try {
    const hostel_detail =
      "SELECT COUNT(`hostel_id`) AS hostelCount FROM `tbl_hostel_master` WHERE `flag` = 1 AND `hostel_name` = ?";
    const [response] = await db.query(hostel_detail, [hostel_name]);

    if (response[0]?.count > 0) {
      return res.status(400).json({ message: "Hostel already exists" });
    }

    const insertQuery = `
  INSERT INTO tbl_hostel_master 
  (hostel_name, contact_number, total_floors, tenant, address, state, district, city, pincode)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`;
    const values = [
      hostelName,
      contactNumber,
      totalFloors,
      tenantType,
      address,
      state_id,
      dist_id,
      city,
      pincode,
    ];
    const [insertResult] = await db.query(insertQuery, values);
    res.status(200).json({
      message: "Data inserted successfully",
      insertedId: insertResult.insertId,
    });
  } catch (error) {
    console.error("Insert Hostel Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const gettHostelDetails = async (req, res) => {
  try {
    const query = `
    SELECT
      a.*,
      b.state_title,
      c.dist_name
    FROM
      tbl_hostel_master AS a
    INNER JOIN tbl_state_master AS b ON a.state = b.state_id
    INNER JOIN tbl_dist_master AS c ON c.dist_id = a.district
    WHERE
      a.flag = 1 ORDER BY a.hostel_id ASC;
  `;

    const [row] = await db.query(query);
    res.status(200).json(row);
  } catch (error) {
    console.error("Error fetching hostel details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteHostelDetails = async (req, res) => {
  const { hostel_id } = req.body;

  try {
    const [result] = await db.query(
      "UPDATE`tbl_hostel_master` SET `flag` =  0  WHERE `hostel_id` = ?",
      [hostel_id]
    );
    const affectedRow = result.affectedRows;

    if (affectedRow) {
      res.status(200).json({ message: "Deleted Successfully" });
    } else {
      res.status(400).json({ message: "Failed to Delete the data" });
    }
  } catch (error) {
    console.error("Error while delete the details:", error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

const updateHostelDetails = async (req, res) => {
  const {
    hostelName,
    contactNumber,
    totalFloors,
    tenantType,
    address,
    state_id,
    dist_id,
    city,
    pincode,
    id,
  } = req.body;

  const values = [
    hostelName,
    contactNumber,
    totalFloors,
    tenantType,
    address,
    state_id,
    dist_id,
    city,
    pincode,
    id,
  ];

  try {
    if (!id) {
      res.status(400).json({ message: "Hostel id is not present" });
    }

    const query =
      "UPDATE tbl_hostel_master SET hostel_name = ? , contact_number = ? , total_floors =? , tenant = ? , address = ?, state =? , district =? , city=? , pincode= ? , active_sts =  1  WHERE flag =  1 AND hostel_id =?";

    const [updateResult] = await db.query(query, values);
    const affectedRow = updateResult.changedRows;

    if (affectedRow) {
      res.status(200).json({ message: "Data updated Successfully" });
    } else {
      res.status(400).json({ message: "No datas updated" });
    }
  } catch (error) {
    console.error("Error while update the details:", error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export default {
  insertHostelDetails,
  gettHostelDetails,
  deleteHostelDetails,
  updateHostelDetails,
};
