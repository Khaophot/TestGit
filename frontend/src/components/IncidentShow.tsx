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
import { IncidentsInterface } from "../models/IIncident";

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

function Incidents() {
  const classes = useStyles();
  const [incidents, setIncidents] = useState<IncidentsInterface[]>([]);
  const apiUrl = "http://localhost:8080";
  
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  };

  const getIncidents = async () => {
    fetch(`${apiUrl}/incidents`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        console.log(res.data);
        if (res.data) {
            setIncidents(res.data);
        } else {
          console.log("else");
        }
      });
  };

  useEffect(() => {
    getIncidents();
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
              ข้อมูลการรับเหตุ
            </Typography>
          </Box>
          <Box>
            <Button
              component={RouterLink}
              to="/incident/create"
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
                <TableCell align="center" width="3%">
                  ลำดับ
                </TableCell>
                <TableCell align="center" width="5%">
                  หัวข้อ
                </TableCell>
                <TableCell align="center" width="10%">
                  ชื่อผู้แจ้ง
                </TableCell>
                <TableCell align="center" width="5%">
                  จำนวนคาดการณ์ผู้ป่วย
                </TableCell>
                <TableCell align="center" width="10%">
                  สถานที่เกิดเหตุ
                </TableCell>
                <TableCell align="center" width="10%">
                  ความเร่งด่วน
                </TableCell>
                <TableCell align="center" width="10%">
                  ชื่อผู้บันทึก
                </TableCell>
                <TableCell align="center" width="10%">
                  วันที่รับเหตุ
                </TableCell>
 
              </TableRow>
            </TableHead>
            <TableBody>
              {incidents.map((item: IncidentsInterface) => (
                <TableRow key={item.ID}>
                  <TableCell align="center">{item.ID}</TableCell>
                  <TableCell align="center">{item.Title}</TableCell>
                  <TableCell align="center">{item.Informer}</TableCell>
                  <TableCell align="center">{item.Numberpatient}</TableCell>
                  <TableCell align="center">{item.Location}</TableCell>
                  <TableCell align="center">{item.Urgency.Value}</TableCell>
                  <TableCell align="center">{item.Employee.Name}</TableCell>
                  <TableCell align="center">{format((new Date(item.Datetime)), 'dd MMMM yyyy hh:mm a')}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </div>
  );
}

export default Incidents;