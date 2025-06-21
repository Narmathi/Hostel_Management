import db from "../config/database.js";

const insertFloorDetails = async (req, res) => {
  const { hostel_id, floor_id, total_rooms } = req.body;

  try {
    const query =
      "SELECT COUNT(`floor_master_id`) AS floor_count FROM `tbl_floor_master` WHERE `hostel`  = ? AND `floor` = ? AND `flag` =  1;";
    const [rows] = await db.query(query, [hostel_id, floor_id]);

    const total_count = rows[0].floor_count;

    if (total_count <= 0) {
      const insertQuery = `
      INSERT INTO tbl_floor_master 
      (hostel, floor, floor_room)
      VALUES (?, ?, ?)
    `;
      const values = [hostel_id, floor_id, total_rooms];

      const [insertResult] = await db.query(insertQuery, values);

      res.status(200).json({
        message: "Data inserted successfully",
        insertedId: insertResult.insertId,
      });
    } else {
      res.status(400).json({
        message: "Selected Floors alreay has assigned rooms",
      });
    }
  } catch (error) {
    console.error("Insert Room Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

const getFloorDetails = async (req, res) => {
  try {
    const query = `
      SELECT a.*, b.floor_name, c.hostel_name
      FROM tbl_floor_master AS a
      INNER JOIN floor_name AS b ON a.floor = b.id
      INNER JOIN tbl_hostel_master AS c ON a.hostel = c.hostel_id
      WHERE a.flag = 1;
    `;

    const [row] = await db.query(query);
    res.status(200).json(row);
  } catch (error) {
    console.error("Error fetching hostel details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateFloorDetails = async (req, res) => {
  const { hostel_id, floor_id, total_rooms, id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Floor id is not present" });
  }

  try {
    const checkQuery = `
      SELECT COUNT(floor_master_id) AS floor_count 
      FROM tbl_floor_master 
      WHERE hostel = ? AND floor = ? AND floor_master_id != ?;
    `;
    const [rows] = await db.query(checkQuery, [hostel_id, floor_id, id]);

    if (rows[0].floor_count > 0) {
      return res
        .status(400)
        .json({ message: "Floor already exists for this hostel" });
    }

    const updateQuery = `
      UPDATE tbl_floor_master 
      SET hostel = ?, floor = ?, floor_room = ? 
      WHERE flag = 1 AND floor_master_id = ?;
    `;
    const [updateResult] = await db.query(updateQuery, [
      hostel_id,
      floor_id,
      total_rooms,
      id,
    ]);

    if (updateResult.changedRows) {
      res.status(200).json({ message: "Data updated successfully" });
    } else {
      res.status(400).json({ message: "No data updated" });
    }
  } catch (error) {
    console.error("Error while updating the details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteFloorDetails = async (req, res) => {
  const { floor_id } = req.body;

  try {
    const [result] = await db.query(
      "UPDATE `tbl_floor_master` SET `flag`= 0 WHERE `floor_master_id` = ?",
      [floor_id]
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

export default {
  insertFloorDetails,
  getFloorDetails,
  updateFloorDetails,
  deleteFloorDetails,
};
