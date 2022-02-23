import { useEffect, useState } from "react";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from '@material-ui/core/Grid';
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import Select from '@material-ui/core/Select';
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
  } from "@material-ui/pickers";
  import DateFnsUtils from "@date-io/date-fns";
import { EmployeesInterface } from "../models/IEmployee";
import { PatientInterface } from "../models/IPatient";
import { AmbulanceOnDutyInterface } from "../models/IAmbulanceOnDuty";
import { AmbulanceArrivalInterface } from "../models/IAmbulanceArrival";
import { AmbulancesInterface } from "../models/IAmbulance";

const Alert = (props: AlertProps) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  };
  
  const useStyles = makeStyles((theme: Theme) =>
    createStyles({
      root: {flexGrow: 1},
      container: {marginTop: theme.spacing(2)},
      table: { minWidth: 650},
      tableSpace: {marginTop: 20},
      paper: {padding: theme.spacing(8),color: theme.palette.text.secondary},
      formControl: {
        margin: theme.spacing(1),
        minWidth: 350,
      },
      selectEmpty: {
        marginTop: theme.spacing(2),
      }
   })
  );

  function AmbulanceArrivalCreate() {
    const classes = useStyles();
     const [type, settype] = React.useState('');
     const [state, setstate] = React.useState('');
     const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
     const [ambulaneonduty, setAmbulanceOnDuty] = useState<AmbulanceOnDutyInterface[]>([]);
     const [ambulance, setAmbulance] = useState<AmbulancesInterface[]>([]);
     const [patient, setPatient] = useState<PatientInterface[]>([]);
     const [employee, setEmployee] = useState<EmployeesInterface>();
     const [ambulancearrival, setAmbulanceArrival] = useState<Partial<AmbulanceArrivalInterface>>(
       {}
     );
     const [success, setSuccess] = useState(false);
     const [error, setError] = useState(false);
     const [errorMessage, setErrorMessage] = useState("");

     const apiUrl = "http://localhost:8080";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
    const handleInputChange = (
      event: React.ChangeEvent<{ id?: string; value: any }>
    ) => {
      const id = event.target.id as keyof typeof ambulancearrival;
      const { value } = event.target;
      setAmbulanceArrival({ ...ambulancearrival, [id]: value });
    };
    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
      if (reason === "clickaway") {
        return;
      }
      setSuccess(false);
      setError(false);
    };
    const handleChange = (
      event: React.ChangeEvent<{ name?: string; value: unknown }>
    ) => {
      const name = event.target.name as keyof typeof ambulancearrival;
      setAmbulanceArrival({
        ...ambulancearrival,
        [name]: event.target.value,
      });
    };
    const handleDateChange = (date: Date | null) => {
      console.log(date);
      setSelectedDate(date);
    };
    const getAmbulanceOnDuty = async () => {
      fetch(`${apiUrl}/ambulanceonduties/ambulance`, requestOptions)
        .then((response) => response.json())
        .then((res) => {
          if (res.data) {
            setAmbulanceOnDuty(res.data);
          } else {
            console.log("else");
          }
        });
    };
    const getPatient = async () => {
      fetch(`${apiUrl}/patients`, requestOptions)
        .then((response) => response.json())
        .then((res) => {
          if (res.data) {
            setPatient(res.data);
          } else {
            console.log("else");
          }
        });
    };
    const getAmbulance = async () => {
      fetch(`${apiUrl}/ambulances`, requestOptions)
        .then((response) => response.json())
        .then((res) => {
          if (res.data) {
            setAmbulance(res.data);
          } else {
            console.log("else");
          }
        });
    };
    const getEmployee = async () => {
      const uid = Number(localStorage.getItem("uid"));
      fetch(`${apiUrl}/employee/${uid}`, requestOptions)
        .then((response) => response.json())
        .then((res) => {
          if (res.data) {
            setEmployee(res.data);
          } else {
            console.log("else");
          }
        });
    };
    
    useEffect(() => {
      getAmbulanceOnDuty();
      getPatient();
      getEmployee();
      getAmbulance();
    }, []);
   
    const convertType = (data: string | number | undefined) => {
      let val = typeof data === "string" ? parseInt(data) : data;
      return val;
    };
    const convertType1 = (data: string | number | undefined) => {
      let val = typeof data === "string" ? parseFloat(data) : data;
      return val;
    };
  
    function submit() {
      let data = {
        Number_of_passenger: convertType(ambulancearrival.Number_of_passenger),
        Distance:         convertType1(ambulancearrival.Distance),
		    DateTime:         selectedDate,
		    RecorderID: convertType(employee?.ID),
		    PatientID:          convertType(ambulancearrival.PatientID),
        AmbulanceOnDutyID:  convertType(ambulancearrival.AmbulanceOnDutyID),
      };
      console.log(data);
  
      const requestOptionsPost = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };
  
      fetch(`${apiUrl}/ambulancearrivals`, requestOptionsPost)
        .then((response) => response.json())
        .then((res) => {
          if (res.data) {
            console.log("บันทึกได้")
            setSuccess(true);
            setErrorMessage("")
          } else {
            console.log("บันทึกไม่ได้")
            setError(true);
            setErrorMessage(res.error)
          }
        });
    }
  
    return (
     <div>
       <Container className={classes.container} maxWidth="md"> 
        <Snackbar open={success} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success">
              บันทึกข้อมูลสำเร็จ
            </Alert>
          </Snackbar>
          <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error">
              บันทึกข้อมูลไม่สำเร็จ: {errorMessage}
            </Alert>
          </Snackbar>
        <Paper className={classes.paper}>
        <Grid container spacing={2} className={classes.root}>
            <Grid item xs={6}>
              <Box display="flex">
                <Box flexGrow={1}>
                  <Typography variant="h6" color= "primary" gutterBottom>
                    Ambulance Arrival  
                  </Typography>
                </Box>
              </Box>
            </Grid>
        </Grid>
              
          <Grid item xs={4}>
              <p></p>
          </Grid>
          <Grid container spacing={3} className={classes.root}>
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined">
                <p>หมายเลขรถพยาบาล</p>
                <Select
                  native
                  value={ambulancearrival.AmbulanceOnDutyID}
                  onChange={handleChange}
                  inputProps={{
                    name: "AmbulanceOnDutyID",
                  }}
                >
                  <option aria-label="None" value="">
                    กรุณาเลือกเลขรถพยาบาล
                  </option>
                  {ambulaneonduty.map((item: AmbulanceOnDutyInterface) => (
                    <option value={item.ID} key={item.ID}>
                      {item.Ambulance.Registration}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            </Grid>
            <Grid container spacing={3} className={classes.root}>
            <Grid item xs={6}>
                <FormControl fullWidth variant="outlined">
                    <p>จำนวนผู้ที่นั่งรถกลับ *ไม่รวมพนักงาน</p>
                    <TextField
                      id="Number_of_passenger"
                      variant="outlined"
                      type="number"
                      size="medium"
                      InputProps={{ inputProps: { min: 1 } }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      placeholder="กรุณากรอกจำนวนผู้นั่งรถกลับ"
                      value={ambulancearrival.Number_of_passenger}
                      onChange={handleInputChange}
                    />
                </FormControl>
              </Grid>
            <Grid item xs={6}>
                <p>ระยะทาง(กิโลเมตร) *กรุณากรอกเป็นทศนิยม</p>
                <FormControl fullWidth variant="outlined">
                  <TextField
                    id="Distance"
                    variant="outlined"
                    type="float"
                    size="medium"
                    placeholder="กรุณากรอกระยะทาง"
                    value={ambulancearrival.Distance || ""}
                    onChange={handleInputChange}
                  />
                </FormControl>
                </Grid>
                </Grid>
            <Grid container spacing={3} className={classes.root}>
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined">
                <p>ชื่อผู้ป่วย</p>
                <Select
                  native
                  value={ambulancearrival.PatientID}
                  onChange={handleChange}
                  inputProps={{
                    name: "PatientID",
                  }}
                >
                  <option aria-labe1="None" value="">
                    กรุณาเลือกชื่อผู้ป่วย
                  </option>
                  {patient.map((item: PatientInterface) => (
                    <option value={item.ID} key={item.ID}>
                      {item.Name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined">
                <p>วันที่</p>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDateTimePicker
                  name="DateTime"
                  value={selectedDate}
                  onChange={handleDateChange}
                  label="กรุณาเลือกวันที่"
                  minDate={new Date("2018-01-01T00:00")}
                  format="yyyy/MM/dd hh:mm a"
                  />
                  </MuiPickersUtilsProvider>
              </FormControl>
            </Grid>
            </Grid>
            <Grid container spacing={3} className={classes.root}>
              <Grid item xs={6}>
                <FormControl fullWidth variant="outlined" >
                  <p>พนักงานที่บันทึกข้อมูล</p>
                  <Select
                    native
                    disabled
                    value={ambulancearrival.RecorderID}
                    // onChange={handleChange}
                    // inputProps={{
                    //   name: "RecorderID",
                    // }}
                  >
                    <option aria-labe1="None" value="">
                        {employee?.Name}
                      </option>
                    
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          <Grid item xs={4}>
              <p></p>
          </Grid>
          <Button
            style={{ float: "right" }}
            variant="contained"
            onClick={submit}
            color="primary"
            >
              ยืนยันข้อมูล
          </Button>
          <Grid item xs={4}>
              <p></p>
          </Grid>
        </Paper>
       </Container>
      </div>
 );
  }
  export default AmbulanceArrivalCreate;
  