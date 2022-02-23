import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  makeStyles,
  Theme,
  createStyles,
  alpha,
} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
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


import { PatientInterface } from "../models/IPatient";
import { EmployeesInterface } from "../models/IEmployee";
import { IncidentsInterface } from "../models/IIncident";
import { AssessmentInterface } from "../models/IAssessment";

import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { id } from "date-fns/locale";
import { AssessmentSharp } from "@material-ui/icons";

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

function AssessmentCreate() {
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [patients, setPatients] = useState<PatientInterface[]>([]);
  const [employees, setEmployees] = useState<EmployeesInterface>();
  const [incidents, setIncidents] = useState<IncidentsInterface[]>([]);
  const [assessment, setAssessment] = useState<Partial<AssessmentInterface>>(
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
    const name = event.target.name as keyof typeof assessment;
    setAssessment({
      ...assessment,
      [name]: event.target.value,
    });
  };

  const handleDateChange = (date: Date | null) => {
    console.log(date);
    setSelectedDate(date);
  };

  const handleInputChange = (
    event: React.ChangeEvent<{ id?: string; value: any }>
  ) => {
    const id = event.target.id as keyof typeof assessment;
    const { value } = event.target;
    setAssessment({ ...assessment, [id]: value });
  };

  const handleChangeTextField = (
    event: React.ChangeEvent<{ id?: string; value: any }>) => {
    const id = event.target.id as keyof typeof AssessmentCreate;
    const { value } = event.target;
    setAssessment({ ...assessment, [id]: value });
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

  const getPatients = async () => {
    fetch(`${apiUrl}/patients`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setPatients(res.data);
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
          setEmployees(res.data);
        } else {
          console.log("else");
        }
      });
  };

  useEffect(() => {
    getIncidents();
    getPatients();
    getEmployee();
  }, []);

  const convertType = (data: string | number | undefined) => {
    let val = typeof data === "string" ? parseInt(data) : data;
    return val;
  };

  function submit() {
    let data = {
      IncidentID: convertType(assessment.IncidentID),
      PatientID: convertType(assessment.PatientID),
      RecorderID: convertType(employees?.ID),
      Datetime: selectedDate,
      Symptom: assessment.Symptom ?? "",
      SymptomLevel: convertType(assessment.SymptomLevel),
    };

    console.log(data)

    const requestOptionsPost = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    fetch(`${apiUrl}/assessments`, requestOptionsPost)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setSuccess(true);
          setErrorMessage("")
        } else {
          setError(true);
          setErrorMessage(res.error)
        }
      });
  }

  // console.log(Incidents)
  // console.log(Patients)
  // console.log(employees)

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
              ประเมินอาการผู้ป่วย
            </Typography>
          </Box>
        </Box>
        <Divider />
        <Grid container spacing={3} className={classes.root}>
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined">
                <p>หัวข้อ รับเหตุ</p>
                <Select
                  native
                  value={assessment.IncidentID}
                  onChange={handleChange}
                  inputProps={{
                    name: "IncidentID",
                  }}
                >
                  <option aria-label="None" value="">
                    กรุณาเลือกหัวข้อ                 
                  </option>
                  {incidents.map((item: IncidentsInterface) => (
                    <option value={item.ID} key={item.ID}>
                      {item.Title}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>Patient Name:</p>
              <Select
                native
                value={assessment.PatientID}
                onChange={handleChange}
                inputProps={{
                  name: "PatientID",
                }}
              >
                <option aria-label="None" value="">
                  กรอกชื่อผู้ป่วย
                </option>
                {patients.map((item: PatientInterface) => (
                  <option value={item.ID} key={item.Name}>
                    {item.Name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
            <p>พนักงานที่บันทึกข้อมูล</p>

                {<Select
                  native
                  disabled
                  value={assessment.RecorderID}
                >
                  <option aria-label="None" value="">
                  {employees?.Name}
                </option>
                </Select>}

            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>อาการ</p>
              <TextField
                id="Symptom"
                variant="outlined"
                type="string"
                size="medium"
                placeholder="ระบุอาการผู้ป่วย"
                value={assessment.Symptom || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>ระดับความรุนแรงของอาการ</p>
              <TextField
                id="SymptomLevel"
                variant="outlined"
                type="number"
                size="medium"
                InputProps={{ inputProps: { min: 1} }}
                InputLabelProps={{
                  shrink: true,
                }}
                value={assessment.SymptomLevel || ""}
                onChange={handleChangeTextField}
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>Time</p>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDateTimePicker
                  name="AssessmentTime"
                  value={selectedDate}
                  onChange={handleDateChange}
                  label="กรุณาเลือกวันที่และเวลา"
                  minDate={new Date("2018-01-01T00:00")}
                  format="yyyy/MM/dd hh:mm a"
                />
              </MuiPickersUtilsProvider>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button
              component={RouterLink}
              to="/"
              variant="contained"
            >
              กลับ
            </Button>
            <Button
              style={{ float: "right" }}
              variant="contained"
              onClick={submit}
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

export default AssessmentCreate;