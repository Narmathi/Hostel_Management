import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import {
  Inbox as InboxIcon,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ open }) => {
  const [openNested, setOpenNested] = useState(false);
  const navigate = useNavigate();

  const handleToggle = () => {
    setOpenNested(!openNested);
  };

  return (
    <List component="nav">
      {/* Parent item with collapse toggle */}
      <ListItem disablePadding sx={{ display: "block" }} onClick={handleToggle}>
        <ListItemButton
          sx={[
            { minHeight: 48, px: 2.5 },
            open ? { justifyContent: "initial" } : { justifyContent: "center" },
          ]}
        >
          <ListItemIcon
            sx={[
              { minWidth: 0, justifyContent: "center" },
              open ? { mr: 3 } : { mr: "auto" },
            ]}
          >
            <InboxIcon />
          </ListItemIcon>
          <ListItemText
            primary="Reports"
            sx={[open ? { opacity: 1 } : { opacity: 0 }]}
          />
          {open ? openNested ? <ExpandLess /> : <ExpandMore /> : null}
        </ListItemButton>
      </ListItem>

      {/* Nested items inside collapse */}
      <Collapse in={openNested} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItem
            disablePadding
            sx={{ display: "block" }}
            onClick={() => navigate("/sales")}
          >
            <ListItemButton
              sx={[
                { minHeight: 40, pl: open ? 4 : 2.5 },
                open
                  ? { justifyContent: "initial" }
                  : { justifyContent: "center" },
              ]}
            >
              <ListItemIcon
                sx={[
                  { minWidth: 0, justifyContent: "center" },
                  open ? { mr: 3 } : { mr: "auto" },
                ]}
              >
                <InboxIcon />
              </ListItemIcon>
              <ListItemText
                primary="Sales Report"
                sx={[open ? { opacity: 1 } : { opacity: 0 }]}
              />
            </ListItemButton>
          </ListItem>

          <ListItem
            disablePadding
            sx={{ display: "block" }}
            onClick={() => navigate("/inventory")}
          >
            <ListItemButton
              sx={[
                { minHeight: 40, pl: open ? 4 : 2.5 },
                open
                  ? { justifyContent: "initial" }
                  : { justifyContent: "center" },
              ]}
            >
              <ListItemIcon
                sx={[
                  { minWidth: 0, justifyContent: "center" },
                  open ? { mr: 3 } : { mr: "auto" },
                ]}
              >
                <InboxIcon />
              </ListItemIcon>
              <ListItemText
                primary="Inventory Report"
                sx={[open ? { opacity: 1 } : { opacity: 0 }]}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Collapse>

      {/* Regular nav item (like you already had) */}
      <ListItem
        disablePadding
        sx={{ display: "block" }}
        onClick={() => navigate("/hosteldetails")}
      >
        <ListItemButton
          sx={[
            { minHeight: 48, px: 2.5 },
            open ? { justifyContent: "initial" } : { justifyContent: "center" },
          ]}
        >
          <ListItemIcon
            sx={[
              { minWidth: 0, justifyContent: "center" },
              open ? { mr: 3 } : { mr: "auto" },
            ]}
          >
            <InboxIcon />
          </ListItemIcon>
          <ListItemText
            primary="Hostel Details"
            sx={[open ? { opacity: 1 } : { opacity: 0 }]}
          />
        </ListItemButton>
      </ListItem>
    </List>
  );
};

export default Sidebar;
