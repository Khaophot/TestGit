import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  makeStyles,
  Theme,
  createStyles,
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

import { EmployeesInterface } from "../models/IEmployee";
import { AmbulancesInterface } from "../models/IAmbulance";
import { ProblemsInterface } from "../models/IProblem";
import { AmbulanceChecksInterface } from "../models/IAmbulanceCheck";

import {
  DateTimePicker,
    KeyboardDateTimePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import MenuItem from '@material-ui/core/MenuItem';
import { now } from "moment";
import AmbulanceChecks from "./AmbulanceCheck";

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

function AmbulanceCheckCreate() {
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [employees, setEmployees] = useState<EmployeesInterface>();
  const [ambulances, setAmbulances] = useState<AmbulancesInterface[]>([]);
  const [problems, setProblems] = useState<ProblemsInterface[]>([]);
  const [ambulancecheck, setAmbulanceCheck] = useState<Partial<AmbulanceChecksInterface>>({});

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
    const name = event.target.name as keyof typeof ambulancecheck;
    setAmbulanceCheck({
      ...ambulancecheck,
      [name]: event.target.value,
    });
  };

  const handleInputChange = (
    event: React.ChangeEvent<{ id?: string; value: any }>
  ) => {
    const id = event.target.id as keyof typeof ambulancecheck;
    const { value } = event.target;
    setAmbulanceCheck({
      ...ambulancecheck, [id]: value });
  };

  const handleDateChange = (date: Date | null) => {
    console.log(date);
    setSelectedDate(date);
  };

  const getEmployees = async () => {
    const uid = Number(localStorage.getItem("uid"));
    fetch(`${apiUrl}/employee/${uid}`, requestOptions)
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
    fetch(`${apiUrl}/ambulances`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setAmbulances(res.data);
        } else {
          console.log("else");
        }
      });
  };

  const getProblems = async () => {
    fetch(`${apiUrl}/problems`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setProblems(res.data);
        } else {
          console.log("else");
        }
      });
  };

  useEffect(() => {
    getEmployees();
    getAmbulances();
    getProblems();
  }, []);

  const convertType = (data: string | number | undefined) => {
    let val = typeof data === "string" ? parseInt(data) : data;
    return val;
  };

  function submit() {
    let data = {
      RecorderID: convertType(employees?.ID),
      AmbulanceID: convertType(ambulancecheck.AmbulanceID),
      ProblemID: convertType(ambulancecheck.ProblemID),
      DocCode: ambulancecheck.DocCode ?? "",
      Severity: convertType(ambulancecheck.Severity),
      Note: ambulancecheck.Note ?? "",
      DateTime: selectedDate,
    };

    console.log(selectedDate);

    const requestOptionsPost = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    fetch(`${apiUrl}/ambulancechecks`, requestOptionsPost)
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
  console.log(ambulances);
  return (
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
                <Box display="flex">
                    <Box flexGrow={1}>
                        <Typography
                            component="h2"
                            variant="h6"
                            color="primary"
                            gutterBottom
                        >
                            ตรวจเช็คความเรียบร้อยรถโรงพยาบาล
                        </Typography>
                    </Box>
                </Box>
                <Divider />

                <Grid item xs={12}>
                        <FormControl fullWidth variant="outlined">
                            <p>วันที่ปัจจุบัน</p>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <KeyboardDateTimePicker
                                    name="DateTime"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    label="กรุณาเลือกวันที่"
                                    minDate={new Date("2018-01-01T00:00")}
                                    format="yyyy-MM-dd hh:mm"

                                />
                            </MuiPickersUtilsProvider>
                      </FormControl>
                  </Grid>

                <Grid container spacing={3} className={classes.root}>
                    <Grid item xs={6}>
                        <FormControl fullWidth variant="outlined">
                            <p>ชื่อ-นามสกุล</p>
                            <Select
                                native
                                disabled
                                value={ambulancecheck.RecorderID}
                            >
                                <option aria-label="None" value="">
                                  {employees?.Name}
                                </option>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                        <FormControl fullWidth variant="outlined">
                            <p>รหัสเอกสาร</p>
                            <TextField
                                id="DocCode"
                                variant="outlined"
                                type="string"
                                size="medium"
                                value={ambulancecheck.DocCode}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                        <FormControl fullWidth variant="outlined">
                            <p>ระดับความรุนแรง</p>
                            <TextField
                                id="Severity"
                                variant="outlined"
                                type="number"
                                size="medium"
                                InputProps={{ inputProps: { min: 1 } }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={ambulancecheck.Severity}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                        <FormControl fullWidth variant="outlined">
                            <p>รถพยาบาล</p>
                            <Select
                                native
                                value={ambulancecheck.AmbulanceID}
                                onChange={handleChange}
                                inputProps={{
                                    name: "AmbulanceID"
                                }}
                            >
                                <option aria-label="None" value="">
                                    เลือกรถ
                                </option>
                                {ambulances.map((item: AmbulancesInterface) => (
                                    <option value={item.ID} key={item.ID}>
                                        {item.CarNumber}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                        <FormControl fullWidth variant="outlined">
                            <p>ปัญหา</p>
                            <Select
                                native
                                value={ambulancecheck.ProblemID}
                                onChange={handleChange}
                                inputProps={{
                                    name: "ProblemID"
                                }}
                            >
                                <option aria-label="None" value="">
                                    เลือกปัญหา
                                </option>
                                {problems.map((item: ProblemsInterface) => (
                                    <option value={item.ID} key={item.ID}>
                                        {item.Name}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={6}>
                        <FormControl fullWidth variant="outlined">
                            <p>หมายเหตุ</p>
                            <TextField
                                id="Note"
                                variant="outlined"
                                type="string"
                                size="medium"
                                value={ambulancecheck.Note}
                                onChange={handleInputChange}
                            />
                        </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            component={RouterLink}
                            to="/ambulancechecks/display"
                            variant="contained"
                        >
                            กลับ
                        </Button>
                        <Button
                            style={{ float: "right" }}
                            onClick={submit}
                            variant="contained"
                            color="primary"
                        >
                            บันทึก
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
}

export default AmbulanceCheckCreate;