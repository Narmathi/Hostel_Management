import * as React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SidebarMenuItem from "./SideMenuItems";
import ApartmentIcon from "@mui/icons-material/Apartment";
import NightShelterOutlinedIcon from "@mui/icons-material/NightShelterOutlined";
import HotelIcon from "@mui/icons-material/Hotel";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import { useNavigate, useLocation } from "react-router-dom";
import GridViewIcon from "@mui/icons-material/GridView";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
const settings = ["Profile", "Account", "Dashboard", "Logout"];
import ManageAccountsTwoToneIcon from "@mui/icons-material/ManageAccountsTwoTone";
import profile from "../assets/profile.jpg";

const drawerWidth = 240;
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: "#37819d",
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

export default function Sidebar() {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const [openNested, setOpenNested] = useState({});
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}logout`,
        null,
        {
          withCredentials: true,
        }
      );

      console.log(response.data);
      localStorage.removeItem("authToken");
      localStorage.removeItem("username");

      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const handleToggle = (key) => {
    setOpenNested((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  //to update active Submenu's
  useEffect(() => {
    const openNested = {};
    menuItems.forEach((item, idx) => {
      if (
        item.nested &&
        item.children.some((child) => child.path === currentPath)
      ) {
        openNested[idx] = true;
      }
    });
    setOpenNested(openNested);
  }, [currentPath]);

  const menuItems = [
    {
      title: "Dashboard",
      path: "/dashboard",
      icon: (isActive) => (
        <GridViewIcon color={isActive ? "primary" : "inherit"} />
      ),
    },
    {
      title: "Manage Hostels",
      icon: () => <ManageAccountsTwoToneIcon />,
      nested: true,
      children: [
        {
          title: "Hostel Details",
          path: "/managehostel/hosteldetails",
        },
        {
          title: "Room Management",
          path: "/managehostel/roommanagement",
        },
      ],
    },
    {
      title: "Manage Floors",
      icon: () => <ApartmentIcon />,
      nested: true,
      children: [
        {
          title: "Hostel Details",
          path: "/managefloors/floorallocation",
        },
      ],
    },
    {
      title: "Manage Rooms",
      icon: () => <NightShelterOutlinedIcon />,
      nested: true,
      children: [
        {
          title: "Room Allocation",
          path: "/managerooms/roomallocation",
        },
      ],
    },
    ,
    {
      title: "Manage Beds",
      icon: () => <HotelIcon />,
      nested: true,
      children: [
        {
          title: "Bed Allocation",
          path: "/managerooms/bedallocation",
        },
      ],
    },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => setOpen(true)}
            edge="start"
            sx={[
              {
                marginRight: 5,
              },
              open && { display: "none" },
            ]}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Hostel Management
          </Typography>
          <Box
            sx={{ display: "flex", flexGrow: 1, justifyContent: "flex-end" }}
          >
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt="Remy Sharp" src={profile} />
            </IconButton>

            <Typography
              variant="h6"
              sx={{ textAlign: "center", padding: 2 }}
              onClick={handleOpenUserMenu}
            >
              {localStorage.getItem("username")}
            </Typography>

            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={handleCloseUserMenu}>
                <Typography sx={{ textAlign: "center" }}>Profile</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Typography sx={{ textAlign: "center" }}>Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={() => setOpen(false)}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List component="nav">
          {menuItems.map((item, idx) => (
            <SidebarMenuItem
              key={idx}
              item={item}
              open={open}
              navigate={navigate}
              currentPath={currentPath}
              openNested={openNested[item.title]}
              handleToggle={() => handleToggle([item.title])}
            />
          ))}
        </List>
        <Divider />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 2 }}>
        <DrawerHeader />
      </Box>
    </Box>
  );
}
