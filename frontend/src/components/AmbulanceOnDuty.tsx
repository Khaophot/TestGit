import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  makeStyles,
  Theme,
  createStyles,
  alpha,
} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Snackbar from "@material-ui/core/Snackbar";
import Select from "@material-ui/core/Select";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";

import { AmbulancesInterface } from "../models/IAmbulance";
import { IncidentsInterface } from "../models/IIncident";
import { EmployeesInterface } from "../models/IEmployee";
import { AmbulanceOnDutyInterface } from "../models/IAmbulanceOnDuty";

import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

const Alert = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    container: {
      marginTop: theme.spacing(2),
    },
    paper: {
      padding: theme.spacing(2),
      color: theme.palette.text.secondary,
    },
  })
);

function PaymentCreate() {
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [recorders, setEmployees] = useState<EmployeesInterface[]>([]);
  const [ambulances, setAmbulances] = useState<AmbulancesInterface[]>([]);
  const [incidents, setIncidents] = useState<IncidentsInterface[]>([]);
  const [ambulanceOnDuty, setAmbulanceOnDuty] = useState<Partial<AmbulanceOnDutyInterface>>(
    {}
  );

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [errorMasage, setErrorMasage] = useState("");

  const apiUrl = "http://localhost:8080";
  const requestOptions = {
    method: "GET",
    headers: { 
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json" },
  };

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccess(false);
    setError(false);
  };

  const handleInputChange = (
    event: React.ChangeEvent<{ id?: string; value: any }>
  ) => {
    const id = event.target.id as keyof typeof ambulanceOnDuty;
    const { value } = event.target;
    setAmbulanceOnDuty({ ...ambulanceOnDuty, [id]: value });
  };

  const handleChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const name = event.target.name as keyof typeof ambulanceOnDuty;
    setAmbulanceOnDuty({
      ...ambulanceOnDuty,
      [name]: event.target.value,
    });
  };

  const handleDateChange = (date: Date | null) => {
    console.log(date);
    setSelectedDate(date);
  };

  const getRecorders = async () => {
    fetch(`${apiUrl}/employees`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setEmployees(res.data);
        } else {
          console.log("else");
        }
      });
  };

  const getAmbulances = async () => {
    fetch(`${apiUrl}/ambulancesForOnDuty`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setAmbulances(res.data);
        } else {
          console.log("else");
        }
      });
  };

  const getIncidents = async () => {
    fetch(`${apiUrl}/incidents`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setIncidents(res.data);
        } else {
          console.log("else");
        }
      });
  };

  useEffect(() => {
    getRecorders();
    getAmbulances();
    getIncidents();
  }, []);

  const convertType = (data: string | number | undefined) => {
    let val = typeof data === "string" ? parseInt(data) : data;
    return val;
  };

  function submit() {
    let data = {
      Code: ambulanceOnDuty.Code,
      AmbulanceID: convertType(ambulanceOnDuty.AmbulanceID),
      IncidentID: convertType(ambulanceOnDuty.IncidentID),
      RecorderID: convertType(Number(localStorage.getItem("uid"))),
      OnDutyDate: selectedDate,
      Passenger: convertType(ambulanceOnDuty.Passenger),
    };

    const requestOptionsPost = {
      method: "POST",
      headers: { 
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };

    fetch(`${apiUrl}/ambulanceonduties/${ambulanceOnDuty.AmbulanceID}`, requestOptionsPost)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          console.log("บันทึกได้");
          setSuccess(true);
          setErrorMasage("");
          getAmbulances();
        } else {
          console.log("บันทึกไม่ได้");
          setError(true);
          setErrorMasage(res.error);
        }
      });
  }

  return (
    <Container className={classes.container} maxWidth="md">
      <Snackbar open={success} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          การบันทึกสำเร็จ
        </Alert>
      </Snackbar>
      <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          การบันทึกมีข้อผิดพลาด :{errorMasage}
        </Alert>
      </Snackbar>
      <Paper className={classes.paper}>
        <Box display="flex">
          <Box flexGrow={1}>
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              Ambulance On Duty System
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Grid container spacing={3} className={classes.root}>
        <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>Code</p>
            <TextField
              id="Code"
              variant="outlined"
              type="string"
              size="medium"
              placeholder="Dxxxxxxxx"
              value={ambulanceOnDuty.Code || ""}
              onChange={handleInputChange}
            />
          </FormControl>
        </Grid>
        <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>Recorder</p>
              <Select
                native
                value={ambulanceOnDuty.RecorderID || Number(localStorage.getItem("uid"))}
                disabled
                inputProps={{name: "RecorderID",}}
              >
                {recorders.map((item: EmployeesInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.Name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth variant="outlined">
              <p>Ambulance</p>
              <Select
                native
                value={ambulanceOnDuty.AmbulanceID}
                onChange={handleChange}
                inputProps={{
                  name: "AmbulanceID",
                }}
              >
                <option aria-label="None" value="">
                  Select Ambulance
                </option>
                {ambulances.map((item: AmbulancesInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.Registration}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>Incident</p>
              <Select
                native
                value={ambulanceOnDuty.IncidentID}
                onChange={handleChange}
                inputProps={{
                  name: "IncidentID",
                }}
              >
                <option aria-label="None" value="">
                  Select Incident
                </option>
                {incidents.map((item: IncidentsInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.Title}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={2}>
            <FormControl fullWidth variant="outlined">
              <p>Passenger</p>
              <TextField
                id="Passenger"
                variant="outlined"
                type="number"
                size="medium"
                inputProps={{min: 1}}
                value={ambulanceOnDuty.Passenger}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
              <p>DateTime</p>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDateTimePicker
                  name="WatchedTime"
                  value={selectedDate}
                  onChange={handleDateChange}
                  label="select Date and Time"
                  minDate={new Date("2018-01-01T00:00")}
                  format="yyyy/MM/dd hh:mm a"
                />
              </MuiPickersUtilsProvider>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button
              component={RouterLink}
              to="/ambulanceonduty/display"
              variant="contained"
            >
              Display
            </Button>
            <Button
              style={{ float: "right" }}
              variant="contained"
              onClick={submit}
              color="primary"
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default PaymentCreate;