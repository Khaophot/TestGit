import React from "react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { createStyles, makeStyles, useTheme, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuIcon from "@material-ui/icons/Menu";

import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import HomeIcon from "@material-ui/icons/Home";
import ViewListIcon from "@material-ui/icons/ViewList";
import AddIcon from "@material-ui/icons/Add";
import ReceiptIcon from "@material-ui/icons/Receipt";
import TocIcon from "@material-ui/icons/Toc";
import LocalShippingRoundedIcon from "@material-ui/icons/LocalShippingRounded";
import BallotIcon from "@material-ui/icons/Ballot";


import { EmployeesInterface } from "../models/IEmployee";

const drawerWidth = 330;

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
      display: "flex",
    },
    title: {
      flexGrow: 1,
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    hide: {
      display: "none",
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: "nowrap",
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: "hidden",
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9) + 1,
      },
    },
    toolbar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    a: {
      textDecoration: "none",
      color: "inherit",
    },
    navlink: {color: "white",textDecoration: "none"},
  })
);

function Navbar() {
 const classes = useStyles();
 const [recorder, setEmployees] = useState<EmployeesInterface>();
 const apiUrl = "http://localhost:8080";
 const requestOptions = {
   method: "GET",
   headers: {
     Authorization: `Bearer ${localStorage.getItem("token")}`,
     "Content-Type": "application/json" },
 };
 const [open, setOpen] = React.useState(false);
 const [token, setToken] = React.useState<String>("");
 const handleDrawerOpen = () => {
  setOpen(true);
};

const handleDrawerClose = () => {
  setOpen(false);
};

const theme = useTheme();
const getRecorder = async (id: Number) => {
  fetch(`${apiUrl}/employee/${id}`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      if (res.data) {
        setEmployees(res.data);
      } else {
        console.log("else");
      }
    });
};

 const signout = () => {
  localStorage.clear();
  window.location.href = "/";
 };

 const menu = [
  { name: "หน้าแรก", icon: <HomeIcon />, path: "/" },
  { name: "สร้างข้อมูลรถโรงพยาบาล", icon: <AddIcon />, path: "/ambulance/create" },
  { name: "การรับเหตุ", icon: <ReceiptIcon />, path: "/incident/create" },
  { name: "แสดงข้อมูลการรับเหตุ", icon: <TocIcon />, path: "/incident/show" },
  { name: "ข้อมูลรถโรงพยาบาล", icon: <ViewListIcon />, path: "/ambulances" },
  { name: "Ambulance Arrival", icon: <LocalShippingRoundedIcon />, path: "/ambulancearrival/create" },
  { name: "ประเมินอาการผู้ป่วย", icon: <BallotIcon />, path: "/assessment/create" },
  { name: "ตรวจเช็คความเรียบร้อย", icon: <AddIcon />, path: "/ambulancechecks/create" },
  { name: "ตารางการตรวจเช็คความเรียบร้อย", icon: <TocIcon />, path: "/ambulancechecks/display" },
  { name: "การรถโรงพยาบาลออกไปปฏิบัติหน้าที่", icon: <AddIcon />, path: "/ambulanceonduty/display" },
];

 useEffect(() => {
  getRecorder(Number(localStorage.getItem("uid")));
 }, []);


 return (
  <div className={classes.root}>
    <AppBar position="fixed"className={clsx(classes.appBar, {[classes.appBarShift]: open,})}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          className={clsx(classes.menuButton, {[classes.hide]: open,})}
        >
          <MenuIcon />
        </IconButton>
        <Grid item xs={9}>
          <Link className={classes.navlink} to="/">
            <Typography variant="h6" className={classes.title}>
              <b>ระบบรถโรงพยาบาล</b>
            </Typography>
          </Link>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h5" className={classes.title}>
            {/* <b>Pongsathon Longchareon ID: A001</b> */}
            {recorder?.Name} ID: {recorder?.ID}
          </Typography>
          <Button color="inherit" onClick={signout}>
          <Typography variant="h6" className={classes.title}>
            Sign Out
          </Typography>
          </Button>
        </Grid>
      </Toolbar>
    </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? ( <ChevronRightIcon />) : ( <ChevronLeftIcon /> )}
          </IconButton>
        </div>
          <Divider />
        <List>
          {menu.map((item, index) => (
            <Link to={item.path} key={item.name} className={classes.a}>
              <ListItem button>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.name} />
              </ListItem>
            </Link>
          ))}
        </List>
      </Drawer>
   </div>
 );
}
export default Navbar;