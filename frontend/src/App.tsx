import React, { useEffect } from "react";
import clsx from "clsx";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import {
  createStyles,
  makeStyles,
  useTheme,
  Theme,
} from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";

import PlayIcon from "@material-ui/icons/PlayArrow";

import HomeIcon from "@material-ui/icons/Home";
import ViewListIcon from "@material-ui/icons/ViewList";
import AddIcon from "@material-ui/icons/Add";
import ReceiptIcon from '@material-ui/icons/Receipt';
import TocIcon from '@material-ui/icons/Toc';
import BallotIcon from '@material-ui/icons/Ballot';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import BuildIcon from '@material-ui/icons/Build';
import DescriptionRoundedIcon from "@material-ui/icons/DescriptionRounded";

import LocalShippingRoundedIcon from "@material-ui/icons/LocalShippingRounded";
import Home from "./components/Home";
import Ambulance from "./components/Ambulance";
import AmbulanceCreate from "./components/AmbulanceCreate";
import AmbulanceCheck from "./components/AmbulanceCheck";
import AmbulanceCheckCreate from "./components/AmbulanceCheckCreate";
import SignIn from "./components/SignIn";
import Navbar from "./components/Navbar";
import IncidentCreate from "./components/IncidentCreate";
import IncidentShow from "./components/IncidentShow"
import AmbulanceArrivalCreate from "./components/AmbulanceArrivalCreate";
import AmbulanceArrivals from "./components/AmbulanceArrivals";
import AssessmentCreate from "./components/AssessmentForm";
import AmbulanceOnDutyCreate from "./components/AmbulanceOnDuty";
import AmbulanceOnDutyDisplay from "./components/AmbulanceOnDutyDisplay";


 
const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  })
);

export default function MiniDrawer() {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [token, setToken] = React.useState<String>("");
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const menu = [
    { name: "หน้าแรก", icon: <HomeIcon />, path: "/" },
    { name: "สร้างข้อมูลรถโรงพยาบาล", icon: <AddIcon />, path: "/ambulance/create" },
    { name: "ข้อมูลรถโรงพยาบาล", icon: <ViewListIcon />, path: "/ambulances" },
    { name: "การรับเหตุ", icon: <ReceiptIcon />, path: "/incident/create" },
    { name: "แสดงข้อมูลการรับเหตุ", icon: <TocIcon />, path: "/incident/show" },
    { name: "Ambulance Arrival", icon: <LocalShippingRoundedIcon />, path: "/ambulancearrival/create" },
    { name: "Ambulance Arrival Display", icon: <DescriptionRoundedIcon />, path: "/ambulancearrivals/show" },
    { name: "การรถโรงพยาบาลออกไปปฏิบัติหน้าที่", icon: <AccessAlarmIcon />, path: "/ambulanceonduty/display" },
    { name: "ประเมินอาการผู้ป่วย", icon: <BallotIcon />, path: "/assessment/create" },
    { name: "ตรวจเช็คความเรียบร้อย", icon: <BuildIcon />, path: "/ambulancechecks/create" },
    { name: "ตารางการตรวจเช็คความเรียบร้อย", icon: <ReceiptIcon />, path: "/ambulancechecks/display" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
    }
  }, []);

  if (!token) {
    return <SignIn />;
  }

  const signout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className={classes.root}>
      <Router>
        <CssBaseline />
        {token && (
          <>
            <AppBar
              position="fixed"
              className={clsx(classes.appBar, {
                [classes.appBarShift]: open,
              })}
            >
              <Toolbar>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDrawerOpen}
                  edge="start"
                  className={clsx(classes.menuButton, {
                    [classes.hide]: open,
                  })}
                >
                  <MenuIcon />
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                  ระบบรถโรงพยาบาล
                </Typography>
                
                <Button color="inherit" onClick={signout}>
                  ออกจากระบบ
                </Button>
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
                  {theme.direction === "rtl" ? (
                    <ChevronRightIcon />
                  ) : (
                    <ChevronLeftIcon />
                  )}
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
          </>
        )}

        <main className={classes.content}>
          <div className={classes.toolbar} />
          <div>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/ambulances" component={Ambulance} />
              <Route exact path="/ambulance/create" component={AmbulanceCreate} />
              <Route exact path="/incident/show" component={IncidentShow} />
              <Route exact path="/incident/create" component={IncidentCreate} />
              <Route exact path="/ambulancearrival/create" component={AmbulanceArrivalCreate}/>
              <Route exact path="/ambulancearrivals/show" component={AmbulanceArrivals}/>
              <Route exact path="/assessment/create" component={AssessmentCreate}/>
              <Route exact path="/ambulancechecks/create" component={AmbulanceCheckCreate}/>
              <Route exact path="/ambulancechecks/display" component={AmbulanceCheck}/>
              <Route exact path="/ambulanceonduty/create" component={AmbulanceOnDutyCreate}/>
              <Route exact path="/ambulanceonduty/display" component={AmbulanceOnDutyDisplay}/>
            </Switch>
          </div>
        </main>
      </Router>
    </div>
  );
}