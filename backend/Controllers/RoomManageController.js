import db from "../config/database.js";

const getHostel = async (req, res) => {
  try {
    const query =
      "SELECT hostel_id,`hostel_name` FROM tbl_hostel_master WHERE `flag` = 1";
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

const getRoomType = async (req, res) => {
  try {
    const query = "SELECT `type_id`,`type_name` FROM `room_type` WHERE flag=1";
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

const insertRoomDetails = async (req, res) => {
  const {
    hostel_id,
    type_id,
    advance_amount,
    total_rent,
    monthly_rent_person,
    daily_rent_person,
    weekly_rent_person,
  } = req.body;

  try {
    const room_detail =
      "SELECT COUNT(`room_master_id`) AS totalrooms FROM `tbl_room_master` WHERE `flag` = 1 AND hostel = ? AND room_type = ?";
    const [response] = await db.query(room_detail, [hostel_id, type_id]);

    if (response[0]?.totalrooms > 0) {
      return res.status(400).json({ message: "Room type already present" });
    }

    const insertQuery = `
      INSERT INTO tbl_room_master 
      (hostel, room_type, advance_amount, total_monthly_rent, rent_per_person, daily_rent_person, weekly_rent_person)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      hostel_id,
      type_id,
      advance_amount,
      total_rent,
      monthly_rent_person,
      daily_rent_person,
      weekly_rent_person,
    ];

    const [insertResult] = await db.query(insertQuery, values);

    res.status(200).json({
      message: "Data inserted successfully",
      insertedId: insertResult.insertId,
    });
  } catch (error) {
    console.error("Insert Room Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const getRoomDetails = async (req, res) => {
  try {
    const query = `SELECT
    a.*,
    b.hostel_name,
    c.type_name,c.type_id
FROM
    tbl_room_master AS a
INNER JOIN tbl_hostel_master AS b
ON
    a.hostel = b.hostel_id
INNER JOIN room_type AS c
ON
    a.room_type = c.type_id
WHERE
    a.flag = 1;
  `;

    const [row] = await db.query(query);
    res.status(200).json(row);
  } catch (error) {
    console.error("Error fetching hostel details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteRoomDetails = async (req, res) => {
  const { room_id } = req.body;

  try {
    const [result] = await db.query(
      "UPDATE `tbl_room_master` SET `flag`= 0 WHERE `room_master_id` = ?",
      [room_id]
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

const updateRoomDetails = async (req, res) => {
  const data = req.body;

  const {
    id,
    hostel_id,
    type_id,
    advance_amount,
    total_rent,
    monthly_rent_person,
    daily_rent_person,
    weekly_rent_person,
  } = req.body;

  const values = [
    hostel_id,
    type_id,
    advance_amount,
    total_rent,
    monthly_rent_person,
    daily_rent_person,
    weekly_rent_person,
    id,
  ];

  try {
    if (!id) {
      res.status(400).json({ message: "Room id is not present" });
    }

    const room_detail =
      "SELECT COUNT(`room_master_id`) AS totalrooms FROM `tbl_room_master` WHERE `flag` = 1 AND hostel = ? AND room_type = ?";
    const [response] = await db.query(room_detail, [hostel_id, type_id]);

    if (response[0]?.totalrooms > 1) {
      return res.status(400).json({ message: "Room type already present" });
    }

    const query =
      "UPDATE tbl_room_master SET hostel = ? , room_type = ? , advance_amount =? , total_monthly_rent = ? , rent_per_person = ?, daily_rent_person =? , weekly_rent_person =?  WHERE flag =  1 AND room_master_id =?";
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
  getHostel,
  getRoomType,
  insertRoomDetails,
  getRoomDetails,
  deleteRoomDetails,
  updateRoomDetails,
};
