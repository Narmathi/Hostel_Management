import db from "../config/database.js";

const insertRoomAllocation = async (req, res) => {
  const {
    hostel_id,
    floor_id,
    room_number,
    total_beds,
    type_id,
    rent_per_bed,
    total_rent,
    occupied_beds,
  } = req.body;

  try {
    const query =
      "SELECT `floor_room` FROM `tbl_floor_master` WHERE `flag` = 1 AND `hostel` = ? AND `floor` = ?";
    const [rows1] = await db.query(query, [hostel_id, floor_id]);

    const total = rows1[0].floor_room;
    const query2 =
      "SELECT COUNT(`room_number`) AS rooms FROM `room_management` WHERE flag = 1 AND `hostel` = ? AND `floor` = ?";
    const [rows2] = await db.query(query2, [hostel_id, floor_id]);

    const occupy = rows2[0].rooms;

    if (occupy >= total) {
      res
        .status(400)
        .json({ message: "All the rooms on this floor are occupied." });
    } else {
      const values = [
        hostel_id,
        type_id,
        floor_id,
        room_number,
        total_beds,
        rent_per_bed,
        total_rent,
        (occupied_beds = 0),
      ];
      const insertQuery = `
      INSERT INTO room_management 
      (hostel, room_type, floor, room_number, total_beds, rent_per_bed, total_rent ,occupied_beds)
      VALUES (?, ?, ?, ?, ?, ?, ? , ?);
    `;

     const [insertResult] = await db.query(insertQuery, values);
     
    }

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

const getRoomtype = async (req, res) => {
  const { hostel_id, room_type } = req.body;
  try {
    const query =
      "SELECT `rent_per_person` ,`total_monthly_rent`  FROM `tbl_room_master` WHERE `room_type` = ? AND `hostel` = ? AND flag =1";
    const [row] = await db.query(query, [room_type, hostel_id]);
    console.log(row);
    res.status(200).json(row);
  } catch (error) {
    console.error("Error fetching hostel details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default { insertRoomAllocation, getRoomtype };
