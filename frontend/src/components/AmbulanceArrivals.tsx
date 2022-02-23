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

import { format } from 'date-fns'
import { AmbulanceArrivalInterface } from "../models/IAmbulanceArrival";

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

function AmbulanceArrivals() {
  const classes = useStyles();
  const [ambulancearrivals, setAmbulanceArrivals] = useState<AmbulanceArrivalInterface[]>([]);
  const apiUrl = "http://localhost:8080";
  
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  };

  const getAmbulanceArrival = async () => {
    fetch(`${apiUrl}/ambulancearrivals`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        console.log(res.data);
        if (res.data) {
            setAmbulanceArrivals(res.data);
        } else {
          console.log("else");
        }
      });
  };

  useEffect(() => {
    getAmbulanceArrival();
  }, []);

  return (
    <div>
      <Container className={classes.container} maxWidth="lg">
        <Box display="flex">
          <Box flexGrow={1}>
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
            >
              ข้อมูลการกลับมาของรถ
            </Typography>
          </Box>
          <Box>
            <Button
              component={RouterLink}
              to="/ambulancearrival/create"
              variant="contained"
              color="primary"
            >
              สร้างข้อมูล
            </Button>
          </Box>
        </Box>
        <TableContainer component={Paper} className={classes.tableSpace}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center" width="10%">
                  ทะเบียนรถ
                </TableCell>
                <TableCell align="center" width="10%">
                  จำนวนคนที่นั่งรถกลับมา
                </TableCell>
                <TableCell align="center" width="10%">
                  ระยะทาง
                </TableCell>
                <TableCell align="center" width="10%">
                  ชื่อผู้ป่วย
                </TableCell>
                <TableCell align="center" width="10%">
                  ชื่อพนักงาน
                </TableCell>
                <TableCell align="center" width="10%">
                  วันที่
                </TableCell>
                
 
              </TableRow>
            </TableHead>
            <TableBody>
              {ambulancearrivals.map((item: AmbulanceArrivalInterface) => (
                <TableRow key={item.ID}>
                  <TableCell align="center">{item.AmbulanceOnDuty.Ambulance.Registration}</TableCell>
                  <TableCell align="center">{item.Number_of_passenger}</TableCell>
                  <TableCell align="center">{item.Distance}</TableCell>
                  <TableCell align="center">{item.Patient.Name}</TableCell>
                  <TableCell align="center">{item.Recorder.Name}</TableCell>
                  <TableCell align="center">{format((new Date(item.DateTime)), 'dd MMMM yyyy hh:mm a')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </div>
  );
}

export default AmbulanceArrivals;