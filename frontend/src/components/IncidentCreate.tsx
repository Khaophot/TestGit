import React, { useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import Divider from "@material-ui/core/Divider";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import { MuiPickersUtilsProvider, KeyboardDatePicker, } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import { IncidentsInterface } from "../models/IIncident";
import { EmployeesInterface } from "../models/IEmployee";
import { UrgenciesInterface } from "../models/IUrgency";
import { IllnessInterface } from "../models/IIllness";
import SendIcon from "@material-ui/icons/Send";


function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: { flexGrow: 1 },
    container: { marginTop: theme.spacing(2) },
    paper: { padding: theme.spacing(2), color: theme.palette.text.secondary },
  })
);

function IncidentCreate() {
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(new Date());
  const [employee, setEmployee] = React.useState<EmployeesInterface>();
  const [illnesses, setIllness] = React.useState<IllnessInterface[]>([]);
  const [urgencies, setUrgencies] = React.useState<UrgenciesInterface[]>([]);
  const [incident, setIncident] = React.useState<Partial<IncidentsInterface>>(
    {}
  );
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const apiUrl = "http://localhost:8080";

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccess(false);
    setError(false);
  };

  const handleDateChange = (date: Date | null) => {
    console.log(date);
    setSelectedDate(date);
  };

  const handleChange = (
    event: React.ChangeEvent<{ name?: string; value: any }>) => {
    const name = event.target.name as keyof typeof IncidentCreate;
    const { value } = event.target;
    setIncident({ ...incident, [name]: value });
  };

  const handleChangeTextField = (
    event: React.ChangeEvent<{ id?: string; value: any }>) => {
    const id = event.target.id as keyof typeof IncidentCreate;
    const { value } = event.target;
    setIncident({ ...incident, [id]: value });
  };

  const requestOptionsGet = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json"
    },
  };

  const getEmployee = async () => {
    let uid = localStorage.getItem("uid");
    fetch(`${apiUrl}/employee/${uid}`, requestOptionsGet)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setEmployee(res.data);
        } else {
          console.log("else");
        }
      });
  };

  const getIllness = async () => {
    fetch(`${apiUrl}/illnesses`, requestOptionsGet)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setIllness(res.data);
        } else {
          console.log("else");
        }
      });
  };

  const getUrgency = async () => {
    fetch(`${apiUrl}/urgencies`, requestOptionsGet)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setUrgencies(res.data);
        } else {
          console.log("else");
        }
      });
  };

  useEffect(() => {
    getEmployee();
    getIllness();
    getUrgency();
  }, []);

  const convertType = (data: string | number | undefined) => {
    let val = typeof data === "string" ? parseInt(data) : data;
    return val;
  };

  console.log(employee?.Name);

  function submit() {
    let data = {
      Title: incident.Title ?? "",
      Informer: incident.Informer ?? "",
      Numberpatient: typeof incident.Numberpatient === "string" ? parseInt(incident.Numberpatient) : 0,
      Location: incident.Location ?? "",
      Datetime: selectedDate,
      EmployeeID: convertType(employee?.ID),
      IllnessID: convertType(incident.IllnessID),
      UrgencyID: convertType(incident.UrgencyID),

    };
    
    console.log(selectedDate);

    const requestOptionsPost = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data),
    };

    fetch(`${apiUrl}/incidents`, requestOptionsPost)
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
              บันทึกการรับเหตุ
            </Typography>
          </Box>

          <Button
            component={RouterLink}
            to="/incident/show"
            variant="text"
            color="primary"
            size = "small"

          >
            แสดงตารางการรับเหตุ
          </Button>

        </Box>
        <Divider />

        <Grid container spacing={3} className={classes.root}>
          <Grid item xs={12}>
            <p>หัวข้อ</p>
            <FormControl fullWidth variant="outlined">
              <TextField
                id="Title"
                variant="outlined"
                type="string"
                size="medium"
                value={incident.Title || ""}
                onChange={handleChangeTextField}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
              <p>ชื่อผู้แจ้ง</p>
              <TextField
                id="Informer"
                variant="outlined"
                type="string"
                size="medium"
                value={incident.Informer || ""}
                onChange={handleChangeTextField}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
              <p>จำนวนคาดการณ์ผู้ป่วย</p>
              <TextField
                id="Numberpatient"
                variant="outlined"
                type="number"
                size="medium"
                InputProps={{ inputProps: { min: 1 } }}
                InputLabelProps={{
                  shrink: true,
                }}
                value={incident.Numberpatient || ""}
                onChange={handleChangeTextField}
              />
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
              <p>สถานที่เกิดเหตุ</p>
              <TextField
                id="Location"
                variant="outlined"
                type="string"
                size="medium"
                value={incident.Location || ""}
                onChange={handleChangeTextField}
              />
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>ลักษณะอาการ</p>
              <Select
                value={incident.IllnessID}
                onChange={handleChange}
                inputProps={{ name: "IllnessID" }}
              >
                <MenuItem aria-label="None" value="">
                  -กรุณาเลือกลักษณะอาการ-
                </MenuItem>
                {illnesses.map((item: IllnessInterface) => (
                  <MenuItem value={item.ID} key={item.ID}>
                    {item.Value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>ความเร่งด่วน</p>
              <Select
                value={incident.UrgencyID}
                onChange={handleChange}
                inputProps={{ name: "UrgencyID" }}
              >
                <MenuItem aria-label="None" value="">
                  -กรุณาเลือกความเร่งด่วน-
                </MenuItem>
                {urgencies.map((item: UrgenciesInterface) => (
                  <MenuItem value={item.ID} key={item.ID}>
                    {item.Value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>วันที่รับเหตุ</p>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  margin="normal"
                  id="Datetime"
                  format="yyyy-MM-dd"
                  value={selectedDate}
                  onChange={handleDateChange}
                  KeyboardButtonProps={{
                    "aria-label": "change date",
                  }}
                />
              </MuiPickersUtilsProvider>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>ชื่อผู้บันทึก</p>

              {<Select
                native
                disabled
              >
                <option value="">
                  {employee?.Name}
                </option>
              </Select>}

            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Button
              style={{ float: "right" }}
              onClick={submit}
              variant="contained"
              color="primary"
              endIcon={<SendIcon />}
            >
              บันทึก
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default IncidentCreate;
