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
import { AmbulancesInterface } from "../models/IAmbulance";
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

function Ambulances() {
  const classes = useStyles();
  const [ambulances, setAmbulances] = useState<AmbulancesInterface[]>([]);
  const apiUrl = "http://localhost:8080";
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  };

  const getAmbulance = async () => {
    fetch(`${apiUrl}/ambulances`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        console.log(res.data);
        if (res.data) {
          setAmbulances(res.data);
        } else {
          console.log("else");
        }
      });
  };

  useEffect(() => {
    getAmbulance();
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
              ข้อมูลรถโรงพยาบาล
            </Typography>
          </Box>
          <Box>
            <Button
              component={RouterLink}
              to="/ambulance/create"
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
                  หมายเลข
                </TableCell>
                <TableCell align="center" width="20%">
                  ทะเบียนรถ
                </TableCell>
                <TableCell align="center" width="10%">
                  ประเภท
                </TableCell>
                <TableCell align="center" width="20%">
                  สถานะ
                </TableCell>
                <TableCell align="center" width="10%">
                  พนักงาน
                </TableCell>
                <TableCell align="center" width="30%">
                  วันที่และเวลา
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ambulances.map((item: AmbulancesInterface) => (
                <TableRow key={item.ID}>
                  <TableCell align="center">{item.CarNumber}</TableCell>
                  <TableCell align="center">{item.Registration}</TableCell>
                  <TableCell align="center">{item.AmbulanceType.Name}</TableCell>
                  <TableCell align="center">{item.Status.Detail}</TableCell>
                  <TableCell align="center">{item.Employee.Email}</TableCell>
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

export default Ambulances;