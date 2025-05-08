import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import { Collapse } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";



// Styles
const buttonStyle = {
  minHeight: 48,
  px: 2.5,
  borderTopRightRadius: 25,
  borderBottomRightRadius: 25,
};

const listIcon = {
  minWidth: 0,
  justifyContent: "center",
};

const listIconStyle = (open) => ({
  ...listIcon,
  mr: open ? 3 : "auto",
});

const listButtonStyle = (open, isActive) => ({
  ...buttonStyle,
  backgroundColor: isActive ? "rgba(82, 125, 144, 0.18)" : "transparent",
  justifyContent: open ? "initial" : "center",
});

const listItemText = (open) => ({
  opacity: open ? 1 : 0,
});

const nestedListIcon = () => ({
  minHeight: 40,
  pl: open ? 4 : 2.5,
  justifyContent: open ? "initial" : "center",
});



const SidebarMenuItem = ({ item, open, currentPath, navigate, openNested, handleToggle }) => {

    const isActive = (path) => currentPath.startsWith(path);
    if (!item.nested) {
      return (
        <ListItem disablePadding sx={{ display: "block" }} onClick={() => navigate(item.path)}>
          <ListItemButton sx={listButtonStyle(open, isActive(item.path))}>
            <ListItemIcon sx={listIconStyle(open)}>{item.icon(isActive(item.path))}</ListItemIcon>
            <ListItemText primary={item.title} sx={listItemText(open)} />
          </ListItemButton>
        </ListItem>
      );
    }
  
    return (
      <>
        <ListItem disablePadding sx={{ display: "block" }} onClick={handleToggle}>
      <ListItemButton sx={listButtonStyle(open, item.children.some(c => isActive(c.path)))}>
        <ListItemIcon sx={listIconStyle(open)}>{item.icon()}</ListItemIcon>
        <ListItemText primary={item.title} sx={listItemText(open)} />
        {open ? openNested ? <ExpandLess /> : <ExpandMore /> : null}
      </ListItemButton>
    </ListItem>

    <Collapse in={openNested || item.children.some(c => isActive(c.path))} timeout="auto" unmountOnExit>
      <List component="div" disablePadding>
        {item.children.map((child, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }} onClick={() => navigate(child.path)}>
            <ListItemButton sx={nestedListIcon}>
              <ListItemIcon sx={listIconStyle(open)}>
                {isActive(child.path) ? (
                  <RadioButtonCheckedIcon sx={{ fontSize: 10, color: "text.secondary" }} />
                ) : (
                  <RadioButtonUncheckedIcon sx={{ fontSize: 10, color: "text.secondary" }} />
                )}
              </ListItemIcon>
              <ListItemText primary={child.title} sx={listItemText(open)} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Collapse>
      </>
    );
  };

  export default SidebarMenuItem;
  