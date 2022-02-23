import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  makeStyles,
  Theme,
  createStyles,
} from "@material-ui/core/styles";
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
import {
  MuiPickersUtilsProvider,
  KeyboardDateTimePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import { AmbulancesInterface } from "../models/IAmbulance";
import { AmbulanceTypesInterface } from "../models/IAmbulanceType";
import { StatusesInterface } from "../models/IStatus";
import { EmployeesInterface } from "../models/IEmployee";
import { TextField } from "@material-ui/core";

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

function AmbulanceCreate() {
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const [ambulancetypes, setAmbulanceTypes] = useState<AmbulanceTypesInterface[]>([]);
  const [statuses, setStatuses] = useState<StatusesInterface[]>([]);
  const [employees, setEmployees] = useState<EmployeesInterface>();
  const [ambulance, setAmbulance] = useState<Partial<AmbulancesInterface>>(
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
    const id = event.target.id as keyof typeof ambulance;
    const { value } = event.target;
    setAmbulance({ ...ambulance, [id]: value });
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
    const name = event.target.name as keyof typeof ambulance;
    setAmbulance({
      ...ambulance,
      [name]: event.target.value,
    });
  };

  const handleDateChange = (date: Date | null) => {
    console.log(date);
    setSelectedDate(date);
  };

  const getAmbulanceType = async () => {
    fetch(`${apiUrl}/ambulancetypes`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setAmbulanceTypes(res.data);
        } else {
          console.log("else");
        }
      });
  };

  const getStatus = async () => {
    fetch(`${apiUrl}/statuses`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setStatuses(res.data);
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
    getAmbulanceType();
    getStatus();
    getEmployee();
  }, []);

  const convertType = (data: string | number | undefined) => {
    let val = typeof data === "string" ? parseInt(data) : data;
    return val;
  };

  function submit() {
    let data = {
      CarNumber: convertType(ambulance.CarNumber),
      Registration: ambulance.Registration ?? "",
      StatusID: convertType(ambulance.StatusID),
      AmbulanceTypeID: convertType(ambulance.AmbulanceTypeID),
      EmployeeID: convertType(employees?.ID),
      DateTime: selectedDate,
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

    fetch(`${apiUrl}/ambulances`, requestOptionsPost)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          console.log("บันทึกได้")
          setSuccess(true)
          setErrorMessage("")
        } else {
          console.log("บันทึกไม่ได้")
          setError(true)
          setErrorMessage(res.error)
        }
      });
  }

  return (
    <Container className={classes.container} maxWidth="md">
        <Snackbar open={success} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success">
            บันทึกสำเร็จ
          </Alert>
        </Snackbar>
        <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error">
            บันทึกผิดพลาด: {errorMessage}
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
                สร้างข้อมูลรถโรงพยาบาล
              </Typography>
            </Box>
          </Box>
          <Divider />
          <Grid container spacing={3} className={classes.root}>
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined">
                <p>หมายเลขรถโรงพยาบาล</p>
                <TextField
                  id="CarNumber"
                  variant="outlined"
                  type="number"
                  size="medium"
                  InputProps={{ inputProps: { min: 1 } }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  placeholder="กรุณากรอกหมายเลขรถโรงพยาบาล"
                  value={ambulance.CarNumber}
                  onChange={handleInputChange}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined">
                <p>ทะเบียนรถโรงพยาบาล</p>
                <TextField
                  id="Registration"
                  variant="outlined"
                  type="string"
                  size="medium"
                  placeholder="กรุณากรอกทะเบียนรถโรงพยาบาล"
                  value={ambulance.Registration || ""}
                  onChange={handleInputChange}
                />
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined">
                <p>ประเภทรถโรงพยาบาล</p>
                <Select
                  native
                  value={ambulance.AmbulanceTypeID}
                  onChange={handleChange}
                  inputProps={{
                    name: "AmbulanceTypeID",
                  }}
                >
                  <option aria-label="None" value="">
                    กรุณาเลือกประเภทรถโรงพยาบาล
                  </option>
                  {ambulancetypes.map((item: AmbulanceTypesInterface) => (
                    <option value={item.ID} key={item.ID}>
                      {item.Name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined">
                <p>สถานะ</p>
                <Select
                  native
                  value={ambulance.StatusID}
                  onChange={handleChange}
                  inputProps={{
                    name: "StatusID",
                  }}
                >
                  <option aria-label="None" value="">
                    กรุณาเลือกสถานะของรถโรงพยาบาล
                  </option>
                  {statuses.map((item: StatusesInterface) => (
                    <option value={item.ID} key={item.ID}>
                      {item.Detail}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined">
                <p>พนักงานที่บันทึกข้อมูล</p>
                <Select
                  native
                  disabled
                  value={ambulance.EmployeeID}
                  /*onChange={handleChange}
                  inputProps={{
                    name: "EmployeeID",
                  }}*/
                >
                  <option aria-label="None" value="">
                  {employees?.Email}
                </option>
                
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth variant="outlined">
                <p>วัน/เวลาในการดำเนินการ</p>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <KeyboardDateTimePicker
                    name="DateTime"
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

export default AmbulanceCreate;