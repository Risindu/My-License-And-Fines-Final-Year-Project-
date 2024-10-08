import './Profile.scss';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link } from 'react-router-dom';

function createData(Description, details) {
    return { Description, details };
  }
  
  const rows = [
    createData('Division ID', '214857'),
    createData('Email', 'hmgpd@police.lk'),
    createData('Address', 'Police Division, Homagama, Sri Lanka'),
    createData('Phone Number', '063152468'),
  ];

function profile() {
  return (
    <div className="profile">
            <h1 className='title'>Homagama Police Division</h1>
            <div className="tableContainer">
              <TableContainer component={Paper}>
                <Table sx={{ minWidth: 65 }} aria-label="simple table">
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow key={row.Description}>
                        <TableCell className='cells' component="th" scope="row">
                          <strong>{row.Description}</strong>
                        </TableCell>
                        <TableCell className='cells1' align="left">
                          {row.details}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
            </div>
            <Link to="/edit" style={{textDecoration:"none"}}>
            <div className="profile__change">
                Do you want to change?
            </div></Link>
            
          </div>
  )
}

export default profile