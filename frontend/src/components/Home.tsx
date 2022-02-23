import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

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

function Home() {
  const classes = useStyles();

  return (
    <div>
      <Container className={classes.container} maxWidth="md">
        <h1 style={{ textAlign: "center" }}>ระบบรถโรงพยาบาล</h1>
        <h4>Requirements</h4>
        <p>
          ระบบรถโรงพยาบาลบริษัท SEgrad4
          เป็นระบบที่ให้ผู้ใช้ระบบซึ่งเป็นพนักงานของโรงพยาบาลสามารถ login เข้า
          ระบบเพื่อจัดสรรรถพยาบาลให้เหมาะกับสถานการณ์ที่มีคำร้องขอความช่วยเหลืออย่างรวดเร็ว 
          โดย ระบบรถโรงพยาบาลของ SEgrad4 เป็นระบบที่พนักงานสามารถกรอกข้อมูลผู้ป่วยที่ติดต่อมา
          ขอความช่วยเหลือ พร้อมทั้งประเมินระดับความอันตรายและเลือกประเภทรถพยาบาลให้เหมาะสม 
          สามารถติดตามข้อมูลการเข้า-ออกของรถโรงพยาบาล รวมถึงข้อมูลและการดูแลความเรียบร้อย
          ของรถโรงพยาบาล
        </p>
      </Container>
    </div>
  );
}
export default Home;