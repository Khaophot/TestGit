import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import { AmbulanceOnDutyInterface } from "../models/IAmbulanceOnDuty";
import { format } from 'date-fns'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      marginTop: theme.spacing(2),
    },
    table: {
      minWidth: 650,
    },
    tableSpace: {
      marginTop: 20,
    },
  })
);

function Display() {
  const classes = useStyles();
  const [ambulanceOnDuty, setAmbulanceOnDuty] = useState<AmbulanceOnDutyInterface[]>([]);
  const apiUrl = "http://localhost:8080/ambulanceonduties";
  const requestOptions = {
    method: "GET",
    headers: { 
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json" },
  };

  const getAmbulanceOnDuty = async () => {
    fetch(`${apiUrl}`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          setAmbulanceOnDuty(res.data);
        } else {
          console.log("else");
        }
      });
  };

  useEffect(() => {
    getAmbulanceOnDuty();
  }, []);

  return (
    <div>
      <Container className={classes.container} maxWidth="md">
        <Box display="flex">
          <Box flexGrow={1}>
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              Ambulance On Duty Record
            </Typography>
          </Box>
          <Box>
            <Button
              component={RouterLink}
              to="/ambulanceonduty/create"
              variant="contained"
              color="primary"
            >
              Add New
            </Button>
          </Box>
        </Box>
        <TableContainer component={Paper} className={classes.tableSpace}>
          <Table className={classes.table} aria-label="Payment table">
            <TableHead>
              <TableRow>
                <TableCell align="center" width="5%">
                  ID
                </TableCell>
                <TableCell align="center" width="15%">
                  Code
                </TableCell>
                <TableCell align="center" width="10%">
                  Ambulance
                </TableCell>
                <TableCell align="center" width="20%">
                  Incident
                </TableCell>
                <TableCell align="center" width="20%">
                  Recorder
                </TableCell>
                <TableCell align="center" width="5%">
                  Passenger
                </TableCell>
                <TableCell align="center" width="25%">
                  DateTime
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ambulanceOnDuty.map((item: AmbulanceOnDutyInterface) => (
                <TableRow key={item.ID}>
                  <TableCell align="center">{item.ID}</TableCell>
                  <TableCell align="center">{item.Code}</TableCell>
                  <TableCell align="center">{item.Ambulance.Registration}</TableCell>
                  <TableCell align="center">{item.Incident.Title}</TableCell>
                  <TableCell align="center">{item.Recorder.Name}</TableCell>
                  <TableCell align="center">{item.Passenger}</TableCell>
                  <TableCell align="center">{format((new Date(item.OnDutyDate)), 'dd MMM yyyy HH:mm')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </div>
  );
}

export default Display;